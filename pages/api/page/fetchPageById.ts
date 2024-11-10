import { getPageById, type SelectPageType } from "~/server/model/page";
import { type ErrorMsg, type Result } from "~/utility/types";

export default async function fetchPageById(id: string): Promise<Result<SelectPageType, ErrorMsg>> {
  const page = await getPageById(id);
  return page;
}
