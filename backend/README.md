<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


## DATABASE TABLE OUTLINE

The backend uses [TypeORM](https://typeorm.io/) as its ORM, connecting to a PostgreSQL database. When `DB_SYNCHRONIZE=true` in `backend/.env`, TypeORM automatically creates and updates table schemas to match the entity definitions on startup (no manual migrations needed during development).

### Tables

#### `menu_items`

Stores every product the shop offers.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `int` (PK, auto-increment) | |
| `name` | `varchar` | Display name |
| `category` | `varchar` | Grouping (e.g. Milk Tea, Fruit Tea, Smoothies, Snacks) |
| `price` | `decimal(6,2)` | Unit price |
| `image` | `varchar` (nullable) | Optional image URL |
| `available` | `boolean` | Defaults to `true`; set to `false` to hide from the kiosk |

On startup, if the table is empty, `MenuItemsService.onModuleInit()` seeds it with 14 default boba shop items so the kiosk is immediately functional.

#### `orders`

One row per customer transaction.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `int` (PK, auto-increment) | Displayed as the order number on the confirmation screen |
| `status` | `varchar` | Defaults to `pending` |
| `order_type` | `varchar` | `dine_in` or `carry_out` |
| `total` | `decimal(8,2)` | Sum of all line items |
| `created_at` | `timestamp` | Auto-set on insert |

#### `order_items`

Individual line items within an order. This is how each ordered product (and its customizations) is traced back to its parent order.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `int` (PK, auto-increment) | |
| `order_id` | `int` (FK &rarr; `orders.id`) | Cascading delete &mdash; removing an order removes its items |
| `menu_item_id` | `int` (FK &rarr; `menu_items.id`) | Which product was ordered |
| `quantity` | `int` | |
| `size` | `varchar` | Defaults to `Regular` |
| `sugar_level` | `varchar` | Defaults to `100%` |
| `ice_level` | `varchar` | Defaults to `Regular` |
| `toppings` | `jsonb` | Array of topping names, e.g. `["Boba", "Coconut Jelly"]` |
| `item_price` | `decimal(6,2)` | Computed price for this line (price &times; quantity) |

### Relationships

```
orders  1 ──── * order_items * ──── 1 menu_items
```

- **orders &harr; order_items**: One order has many order items (`OneToMany`). Each order item belongs to exactly one order (`ManyToOne`). Deleting an order cascades to its items.
- **order_items &harr; menu_items**: Each order item references one menu item (`ManyToOne`, eager-loaded). This lets the API return the full product details alongside order data.

### API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/menu-items` | List all available menu items (optional `?category=` filter) |
| `POST` | `/api/orders` | Place a new order (body: `{ order_type, total, items: [...] }`) |
| `GET` | `/api/orders` | List all orders with their items and menu item details |