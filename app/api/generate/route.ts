import { NextResponse } from "next/server";
import { generateInterviewQuestion } from "../../../lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jobTitle = body.jobTitle || (body.get && body.get('jobTitle'));
    if (!jobTitle) {
      return NextResponse.json({ error: "Missing jobTitle" }, { status: 400 });
    }

    const questions = await generateInterviewQuestion(String(jobTitle));
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('API error', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
