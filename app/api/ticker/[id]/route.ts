import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { unisatApiUrl } from "./../../../../lib/constant";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id || params.id.length !== 4)
    return Response.json({ msg: "Invalid ticker" });
  console.log(`${unisatApiUrl}/indexer/brc20/${params.id}/info`);

  const res = await fetch(`${unisatApiUrl}/indexer/brc20/${params.id}/info`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.UNISAT_API_KEY,
    },
  });
  const data = await res.json();
  const record = await prisma.record.findFirst({
    where: {
      id: {
        equals: params.id,
        mode: 'insensitive',
      }
    }
  })
  if(data.data) {
    data.data.claimed = !!record
  }
  return Response.json(data);
}
