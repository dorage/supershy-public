import { z } from 'https://deno.land/x/zod/mod.ts';

const zSchool = z.object({
  nama: z.string(),
  npsn: z
    .number()
    .or(z.string())
    .transform((arg) => String(arg)),
});

const zCity = z.object({
  nama: z.string(),
  kode_wilayah: z.string().transform((arg) => arg.trim()),
  id_level_wilayah: z.number(),
});

const writeFile = async (filename: string, data: object) => {
  const encoder = new TextEncoder();
  return await Deno.writeFile(`results/${filename}.json`, encoder.encode(JSON.stringify(data)));
};

const sleep = (ms: number) =>
  new Promise((res) =>
    setTimeout(() => {
      res(true);
    }, ms)
  );

const fetchSchool = async (
  cityCode: string,
  level: number,
  schoolType: 'smp' | 'sma' | 'smk'
): Promise<any> => {
  const res = await fetch(
    `https://dapo.kemdikbud.go.id/rekap/progresSP?id_level_wilayah=${level}&kode_wilayah=${cityCode}&semester_id=20231&bentuk_pendidikan_id=${schoolType}`
  );
  let json;

  try {
    json = (await res.json()) as z.infer<typeof zSchool>[];
  } catch (err) {
    console.log(err);
    console.log(`city: ${cityCode} | school_type: ${schoolType}`);
    console.log('sleep for 5 seconds');
    await sleep(5000);
    return fetchSchool(cityCode, level, schoolType);
  }

  return json.map((e) => {
    const { nama, npsn } = zSchool.parse(e);
    return {
      nspn: npsn,
      name: nama,
      city: cityCode,
    };
  });
};

// [root cities]
// https://dapo.kemdikbud.go.id/rekap/dataSekolah?id_level_wilayah=0&kode_wilayah=000000&semester_id=20231
// [child cities]
// https://dapo.kemdikbud.go.id/rekap/dataSekolah?id_level_wilayah=1&kode_wilayah=050000&semester_id=20231
// [schools]
// https://dapo.kemdikbud.go.id/rekap/progresSP?id_level_wilayah=3&kode_wilayah=056020&semester_id=20231&bentuk_pendidikan_id=sd

const getCityId = (code: string, level: number) => code.slice(2 * (level - 1), 2 * level);

const fetchCity = async (code: string, level: number) => {
  const res = await fetch(
    `https://dapo.kemdikbud.go.id/rekap/dataSekolah?id_level_wilayah=${level}&kode_wilayah=${code}&semester_id=20231`
  );
  const json = await res.json();

  const map: any = {};
  const jobs: Promise<any>[] = [];

  for (const city of json) {
    const { nama, id_level_wilayah, kode_wilayah } = zCity.parse(city);
    const id = getCityId(kode_wilayah, id_level_wilayah);

    map[id] = {
      id: id,
      name: nama,
    };

    // sekolah
    if (id_level_wilayah === 3) {
      jobs.push(
        (async () => {
          map[id].smp = await fetchSchool(kode_wilayah, id_level_wilayah, 'smp');
          map[id].smk = await fetchSchool(kode_wilayah, id_level_wilayah, 'smk');
          map[id].sma = await fetchSchool(kode_wilayah, id_level_wilayah, 'sma');
        })()
      );
      // citi
    } else {
      jobs.push(
        (async () => {
          map[id].children = await fetchCity(kode_wilayah, id_level_wilayah);
        })()
      );
    }
  }

  await Promise.all(jobs);

  return map;
};

const collectDapo = async () => {
  const roots = await fetch(
    'https://dapo.kemdikbud.go.id/rekap/dataSekolah?id_level_wilayah=0&kode_wilayah=000000&semester_id=20231'
  );
  const json = await roots.json();

  for (const city of json) {
    const zcity = zCity.parse(city);
    const { id_level_wilayah, kode_wilayah, nama } = zcity;
    const id = getCityId(kode_wilayah, id_level_wilayah);

    try {
      await Deno.stat(`${nama}.json`);
      // successful, file or directory must exist
      console.log(`${nama} is exist already`);
      continue;
    } catch (_) {
      console.log(`start crawl ${nama}`);
    }

    await writeFile(nama, {
      id: id,
      name: nama,
      children: await fetchCity(kode_wilayah, id_level_wilayah),
    });
  }

  return true;
};

await collectDapo();
