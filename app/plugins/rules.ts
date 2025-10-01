import { defineRule, configure } from 'vee-validate'
import * as rules from '@vee-validate/rules'
import { required, email, min } from '@vee-validate/rules';



export default defineNuxtPlugin({
  name: 'my-plugin',
  enforce: 'pre', // or 'post'
  async setup() {
    // Register all the rules globally
    defineRule('required', required)
    defineRule('email', email)
    defineRule('min', min)
    // Object.entries(rules).forEach(([rule, validator]) => {
    //   defineRule(rule, validator as any)
    // })

    // configure({
    //   generateMessage: (ctx) => {
    //     const messages = {
    //       required: `${ctx.field} is required.`,
    //     } as Record<string, string>
    //     return messages[ctx.rule?.name || ''] || `${ctx.field} is invalid.`
    //   },
    // })
  }
})
