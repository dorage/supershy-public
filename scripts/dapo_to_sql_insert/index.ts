const cities: any = [];
const city_schools: any = [];

const getSchools = (json: any, prevId: string) => {
  city_schools.push({ ...json, id: prevId });
};

const getChild = (json: any, prevId: string) => {
  if (json.children == null) {
    return getSchools(json, prevId + json.id);
  }

  const id = (prevId + json.id).padEnd(6, '0');
  const name = json.name;
  const children = [];

  const keys = Object.keys(json.children);

  for (const key of keys) {
    const child = json.children[key as any] as any;
    children.push({ id: (prevId + json.id + child.id).padEnd(6, '0'), name: child.name });

    getChild(child, prevId + json.id);
  }

  cities.push({ id, name, children });
};

const getRoots = () => {
  const files = Deno.readDirSync('scrap_dapo/results');

  const id = ''.padEnd(6, '0');
  const name = 'root';
  const children = [];

  for (const file of files) {
    const decoder = new TextDecoder('utf-8');
    const data = Deno.readFileSync('scrap_dapo/results/' + file.name);

    const json = JSON.parse(decoder.decode(data)) as any;

    children.push({ id: json.id.padEnd(6, '0'), name: json.name });

    getChild(json, '');
  }

  cities.push({ id, name, children });
};

getRoots();

const encoder = new TextEncoder();
Deno.writeFileSync(
  'dapo_to_sql_insert/results/cities.json',
  encoder.encode(JSON.stringify(cities))
);
Deno.writeFileSync(
  'dapo_to_sql_insert/results/city_schools.json',
  encoder.encode(JSON.stringify(city_schools))
);
