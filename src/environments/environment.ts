import { StacksTestnet } from '@stacks/network'

export const environment = {
  production: true,
  explorer_url_prefix: 'explorer.stacks.co',
  network: new StacksTestnet()
}
