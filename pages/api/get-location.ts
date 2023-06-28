/*
  NEXT
*/
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { z } from "zod";

/*
    PLACES SCHEMA
*/
const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const { search } = req.query;

  try {
    const searchParams = z.string().safeParse(search as string)
      ? (search as string)
      : "";

    const results = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${searchParams}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await results.json();
    if (results.ok) {
      const latlang = locationSchema.parse(
        data?.results[0]?.geometry?.location
      );
      return res.status(200).json({ location: latlang });
    } else {
      throw new Error("An error occured while fetching location");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: String(error), code: "400" });
  }
});

// this will run if none of the above matches
router.all((req, res) => {
  res.status(405).json({
    error: "Method not allowed",
  });
});

export default router.handler({
  onError(err, req, res) {
    res.status(500).json({
      error: (err as Error).message,
    });
  },
});
