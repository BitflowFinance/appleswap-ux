import { StacksMocknet } from "@stacks/network";

export const environment = {
  production: false,
  explorer_url_prefix: 'localhost',
  network: new StacksMocknet()
}
