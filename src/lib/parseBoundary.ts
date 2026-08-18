import type { CoordOrder, LonLat } from "./types";

function closeRing(ring: LonLat[]): LonLat[] {
  if (ring.length < 3) return ring;
  const [fx, fy] = ring[0];
  const [lx, ly] = ring[ring.length - 1];
  if (fx !== lx || fy !== ly) return [...ring, ring[0]];
  return ring;
}

function pairNumbers(nums: number[], order: CoordOrder): LonLat[] {
  const pts: LonLat[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const a = nums[i];
    const b = nums[i + 1];
    pts.push(order === "lonlat" ? [a, b] : [b, a]);
  }
  return pts;
}

function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d+(\.\d+)?/g);
  if (!matches) return [];
  return matches.map(Number);
}

function ringFromGeoJsonCoords(coords: unknown): LonLat[] | null {
  if (
    Array.isArray(coords) &&
    Array.isArray(coords[0]) &&
    Array.isArray(coords[0][0]) &&
    typeof coords[0][0][0] === "number"
  ) {
    return (coords[0] as number[][]).map((p) => [p[0], p[1]]);
  }
  return null;
}

/** Parses pasted boundary text in several formats: GeoJSON, JSON array of
 * [x,y] pairs, or a flat list of numbers (comma/space/newline separated). */
export function parseBoundary(
  raw: string,
  order: CoordOrder
): { ring: LonLat[]; error?: string } {
  const text = raw.trim();
  if (!text) return { ring: [], error: "Input kosong" };

  try {
    const json = JSON.parse(text);

    if (json && typeof json === "object" && "type" in json) {
      const type = (json as { type: string }).type;

      if (type === "Polygon") {
        const ring = ringFromGeoJsonCoords((json as { coordinates: unknown }).coordinates);
        if (ring) return { ring: closeRing(ring) };
      }
      if (type === "MultiPolygon") {
        const coords = (json as { coordinates: unknown[] }).coordinates;
        const ring = ringFromGeoJsonCoords(coords?.[0]);
        if (ring) return { ring: closeRing(ring) };
      }
      if (type === "Feature") {
        const geom = (json as { geometry?: { type: string; coordinates: unknown } }).geometry;
        if (geom?.type === "Polygon") {
          const ring = ringFromGeoJsonCoords(geom.coordinates);
          if (ring) return { ring: closeRing(ring) };
        }
        if (geom?.type === "MultiPolygon") {
          const coords = geom.coordinates as unknown[];
          const ring = ringFromGeoJsonCoords(coords?.[0]);
          if (ring) return { ring: closeRing(ring) };
        }
      }
      if (type === "FeatureCollection") {
        const features = (
          json as { features: { geometry?: { type: string; coordinates: unknown } }[] }
        ).features;
        for (const f of features ?? []) {
          if (f.geometry?.type === "Polygon") {
            const ring = ringFromGeoJsonCoords(f.geometry.coordinates);
            if (ring) return { ring: closeRing(ring) };
          }
        }
      }
    }

    if (Array.isArray(json) && Array.isArray(json[0]) && typeof json[0][0] === "number") {
      const ring = (json as number[][]).map((p) =>
        order === "lonlat" ? ([p[0], p[1]] as LonLat) : ([p[1], p[0]] as LonLat)
      );
      return { ring: closeRing(ring) };
    }

    if (Array.isArray(json) && typeof json[0] === "number") {
      return { ring: closeRing(pairNumbers(json as number[], order)) };
    }
  } catch {
    // not JSON — fall through to raw number extraction
  }

  const nums = extractNumbers(text);
  if (nums.length % 2 !== 0) nums.pop();
  if (nums.length < 6) {
    return { ring: [], error: "Koordinat tidak terbaca. Minimal 3 titik (6 angka)." };
  }

  return { ring: closeRing(pairNumbers(nums, order)) };
}

const SAMPLE_BOUNDARY_1 =
  "106.89101531912,-6.4574391164706,106.89102187513,-6.4575945844768,106.89122865668,-6.4575817358236,106.89163687666,-6.4576497352885,106.89166736988,-6.4575061460474,106.89190053552,-6.4575315153711,106.89212788503,-6.4575725337878,106.89229675318,-6.4576543170539,106.89257244411,-6.4578327063739,106.89268514761,-6.4579136217719,106.89287548271,-6.458289519789,106.89313629887,-6.4583458082808,106.89317340247,-6.4581361735386,106.89349721188,-6.4580325736771,106.89355865391,-6.458032345144,106.89365983497,-6.4580319687855,106.89367974975,-6.4582424071149,106.89382381002,-6.4583949711228,106.89397725854,-6.4584996564133,106.89408656431,-6.4587200868851,106.89408713732,-6.45872124243,106.89421272021,-6.4589443054028,106.89430862337,-6.4591146504124,106.89432031085,-6.4596849039338,106.89426992254,-6.4599831207663,106.89408818929,-6.4601078789772,106.89396256748,-6.4600904051029,106.89392701714,-6.4601772541433,106.89383117816,-6.4601297670767,106.89377779145,-6.4602435945827,106.89358035707,-6.460208446448,106.89356885538,-6.460331088798,106.89344323349,-6.4603136148064,106.89339333646,-6.4605619898164,106.89300748013,-6.4605036206313,106.89297627536,-6.4609552620398,106.89292684507,-6.4613292251745,106.89308520626,-6.461307704382,106.8930945192,-6.4614003669787,106.89336069951,-6.4614322691386,106.89338729286,-6.4613484436515,106.89356669112,-6.4613567467611,106.89357549254,-6.4613118605134,106.89363230252,-6.4613146393279,106.89371013853,-6.4613442519777,106.89388309008,-6.461402400187,106.89387543511,-6.4615798651208,106.89387173865,-6.4616308922444,106.89389777545,-6.4616867724785,106.89394667487,-6.4617167319994,106.8940389914,-6.4617365229519,106.89403346429,-6.461902999409,106.89399638599,-6.4619648558293,106.89386896643,-6.4620428369729,106.89372417291,-6.4620792587275,106.89350754789,-6.4620929828028,106.8933439028,-6.4620763680794,106.8931917958,-6.4620754987987,106.89307123572,-6.4620687708421,106.89300241819,-6.4620848153336,106.8929336754,-6.4621209539109,106.89282481882,-6.4621744654727,106.89264701656,-6.462209574447,106.89247577699,-6.4622140887884,106.89210195944,-6.4622690143534,106.89194991611,-6.4622906808885,106.89193255477,-6.462252470436,106.89136573974,-6.4624046379972,106.89123512434,-6.4623950763757,106.89114892225,-6.4623666905462,106.89101810421,-6.4623025876928,106.89094711988,-6.46222360028,106.89056477334,-6.4617905994711,106.89037531378,-6.461547130537,106.89013849442,-6.4611461222486,106.89007806253,-6.4611018519706,106.88967939599,-6.4607818220844,106.88954988026,-6.4606818309655,106.8894090077,-6.4606148942146,106.88908659328,-6.4604507209186,106.88875772677,-6.4602771420765,106.88881614184,-6.4599120859575,106.88890949603,-6.4592897693606,106.88881845823,-6.4592470477322,106.88888012337,-6.4591080717083,106.88898249316,-6.458976709288,106.88904595734,-6.4590003956891,106.88909922987,-6.4588554703285,106.88914222854,-6.458842153689,106.88919100193,-6.4587737951872,106.88925713052,-6.4585486836693,106.88924497768,-6.4584961005398,106.88921504369,-6.4584854467679,106.88923156704,-6.4584321691306,106.88926225382,-6.4581837058001,106.88931252615,-6.4580090386968,106.89053258438,-6.4574662102312,106.89069850968,-6.4574582345005,106.89101531912,-6.4574391164706";

const SAMPLE_BOUNDARY_2 =
  "106.89650,-6.45850,106.90250,-6.45850,106.90250,-6.46350,106.89650,-6.46350,106.89650,-6.45850";

export const SAMPLE_BOUNDARIES = [SAMPLE_BOUNDARY_1, SAMPLE_BOUNDARY_2];
