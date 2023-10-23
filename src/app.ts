import Koa from "koa";
import Router from "koa-router";
import mongoose from "mongoose";
import ClientsModel from "./models/clients.schema";
import PromocodesModel from "./models/promocodes.schema";
import { PaginationFilter } from "./filters/promocodes.filters";

const app = new Koa();
const router = new Router();

mongoose.connect("mongodb://localhost/tz01");

router.get("api/clients", async (ctx) => {
  const page = parseInt(ctx.query.page as string, 10) || 1;
  const limit = parseInt(ctx.query.limit as string, 10) || 10;

  if (page < 1 || limit < 1) {
    ctx.status = 400;
    ctx.body = { error: "Invalid page or limit value." };
    return;
  }

  try {
    const totalCount = await ClientsModel.countDocuments();
    const maxPage = Math.ceil(totalCount / limit);

    if (page > maxPage) {
      ctx.status = 404;
      ctx.body = { error: "Page not found" };
    }

    const items = await ClientsModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    ctx.body = {
      data: items,
      page,
      limit,
      total: totalCount,
      maxPage,
    };
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

router.get("api/clients/:clientId/promocodes", async (ctx) => {
  const { clientId } = ctx.params;
  const promoName = Array.isArray(ctx.request.query.promoName)
    ? (ctx.request.query.promoName[0] as string)
    : (ctx.request.query.promoName as string);

  const page = parseInt(ctx.query.page as string, 10) || 1;
  const limit = parseInt(ctx.query.limit as string, 10) || 10;

  if (page < 1 || limit < 1) {
    ctx.status = 400;
    ctx.body = { error: "Invalid page or limit value." };
    return;
  }

  try {
    const totalCount = await PromocodesModel.countDocuments();
    const maxPage = Math.ceil(totalCount / limit);

    if (page > maxPage) {
      ctx.status = 404;
      ctx.body = { error: "Page not found" };
    }
    const filter: PaginationFilter = { clientId: clientId };
    if (promoName) {
      filter.name = promoName;
    }

    const items = await PromocodesModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    ctx.body = {
      data: items,
      page,
      limit,
      total: totalCount,
      maxPage,
    };
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("server started!");
});
