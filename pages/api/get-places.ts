/*
  NEXT
*/
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { z } from "zod";

/*
    PLACES SCHEMA
*/
const placesSchema = z.object({
  predictions: z.array(
    z.object({
      description: z.string(),
      place_id: z.string().optional(),
      structured_formatting: z.object({
        main_text: z.string(),
        secondary_text: z.string().optional(),
      }),
      types: z.array(z.string()).optional(),
    })
  ),
  status: z.string(),
  error_message: z.string().optional(),
  info_messages: z.array(z.string()).optional(),
});

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const { search } = req.query;

  try {
    const searchParams = z.string().safeParse(search as string)
      ? (search as string)
      : "";

    const data = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchParams}&radius=500&location=3.101,101.584&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    ).then((res) => res.json());

    const parsedData = placesSchema.parse(data);

    if (parsedData.status === "OK") {
      const places = parsedData.predictions.map((place) => ({
        value: `${place.structured_formatting.main_text} ${place.structured_formatting.secondary_text}`,
      }));

      return res.status(200).json({ places });
    } else {
      return res.status(200).json({ places: [] });
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
