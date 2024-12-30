const writeCitySql = async () => {
  const decoder = new TextDecoder('utf-8');
  const data = Deno.readFileSync('dapo_to_sql_insert/results/cities.json');
  const cities = JSON.parse(decoder.decode(data)) as any;

  for (const city of cities) {
    const body = JSON.stringify({
      id: city.id.replaceAll("'", '`'),
      name: city.name.replaceAll("'", '`'),
      children: JSON.stringify(city.children).replaceAll("'", '`'),
    });
    const res = await fetch('http://127.0.0.1:9000/v1/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (res.status !== 200) console.error(await res.text(), body);
  }

  console.log(cities.length);
};

const writeCitySchoolsSql = async () => {
  const decoder = new TextDecoder('utf-8');
  const data = Deno.readFileSync('dapo_to_sql_insert/results/city_schools.json');
  const city_schools = JSON.parse(decoder.decode(data)) as any;

  for (const citySchool of city_schools) {
    const body = JSON.stringify({
      id: citySchool.id.replaceAll("'", '`'),
      name: citySchool.name.replaceAll("'", '`'),
      smp: JSON.stringify(citySchool.smp).replaceAll("'", '`'),
      smk: JSON.stringify(citySchool.smk).replaceAll("'", '`'),
      sma: JSON.stringify(citySchool.sma).replaceAll("'", '`'),
    });
    const res = await fetch('http://127.0.0.1:9000/v1/cities/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (res.status !== 200) console.error(await res.text(), body);
  }
  console.log(city_schools.length);
};

await writeCitySql();
await writeCitySchoolsSql();
