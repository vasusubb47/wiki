
import type { Result, ErrorMsg } from "~/utility/types";
import { type SelectPage, pages } from "~/server/db/schema";
import { type z } from "zod";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";

export type SelectPageType = z.infer<typeof SelectPage>;

export async function getPageById(id: string): Promise<Result<SelectPageType, ErrorMsg>> {
    const page = await db
      .select({
        id: pages.id,
        author_id: pages.author_id,
        createdAt: pages.createdAt,
        updatedAt: pages.updatedAt,
        title: pages.title,
        status: pages.status,
      })
      .from(pages)
      .where(eq(pages.id, id));
    
    if (page.length < 1) {
      return { ok: false, error: { message: "Page not found" } };
    }
    return { ok: true, value: page[0]! };
}
