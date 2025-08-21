import { faker } from "@faker-js/faker";

import type { StreamService as StreamServiceInterface } from "../app/stream.ts";

export class StreamService implements StreamServiceInterface {
  getText() {
    return faker.lorem.paragraphs(32);
  }
}
