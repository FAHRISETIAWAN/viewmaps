import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat & lon wajib diisi" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "18");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "ViewMaps/1.0 (internal boundary viewer)",
      "Accept-Language": "id",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Gagal mengambil data lokasi" }, { status: 502 });
  }

  const data = await res.json();

  return NextResponse.json({
    displayName: data.display_name as string | undefined,
    village: data.address?.village ?? data.address?.suburb,
    district: data.address?.town ?? data.address?.city_district ?? data.address?.district,
    county: data.address?.county ?? data.address?.city,
    state: data.address?.state,
    postcode: data.address?.postcode,
    country: data.address?.country,
  });
}
