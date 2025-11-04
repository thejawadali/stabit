import { reactive, readonly } from 'vue'

type ConfirmationVariant = 'default' | 'destructive'

interface ConfirmationOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmationVariant
}

interface ConfirmationState {
  isOpen: boolean
  title: string
  description: string
  confirmText: string
  cancelText: string
  variant: ConfirmationVariant
  resolveFn: ((value: boolean) => void) | null
}

// singleton shared state
const state = reactive<ConfirmationState>({
  isOpen: false,
  title: '',
  description: '',
  confirmText: 'Yes',
  cancelText: 'No',
  variant: 'default',
  resolveFn: null
})

export function useConfirm(): {
  state: Readonly<ConfirmationState>
  confirm: (options: ConfirmationOptions) => Promise<boolean>
  handleConfirm: () => void
  handleCancel: () => void
} {
  const confirm = ({
    title,
    description,
    confirmText = 'Yes',
    cancelText = 'No',
    variant = 'default'
  }: ConfirmationOptions): Promise<boolean> => {
    state.title = title
    state.description = description
    state.confirmText = confirmText
    state.cancelText = cancelText
    state.variant = variant
    state.isOpen = true

    return new Promise<boolean>((resolve) => {
      state.resolveFn = resolve
    })
  }

  const handleConfirm = (): void => {
    if (state.resolveFn) state.resolveFn(true)
    cleanup()
  }

  const handleCancel = (): void => {
    if (state.resolveFn) state.resolveFn(false)
    cleanup()
  }

  const cleanup = (): void => {
    state.isOpen = false
    state.resolveFn = null
  }

  return {
    state: readonly(state),
    confirm,
    handleConfirm,
    handleCancel
  }
}
