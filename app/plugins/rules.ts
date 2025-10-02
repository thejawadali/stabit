import { defineRule, configure } from 'vee-validate'
import * as rules from '@vee-validate/rules'
import { required, email, min, max } from '@vee-validate/rules';



export default defineNuxtPlugin({
  name: 'my-plugin',
  enforce: 'pre', // or 'post'
  async setup() {
    // Register the rules globally
    defineRule('required', required)
    defineRule('email', email)
    defineRule('min', min)
    defineRule('max', max)
  }
})
