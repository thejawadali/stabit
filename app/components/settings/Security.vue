<template>
  <div class="space-y-6">
    <!-- Change Password -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">🔐</span>
          Change Password
        </CardTitle>
        <CardDescription>
          Update your account password for better security
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="current-password">Current Password</Label>
            <Input
              id="current-password"
              v-model="passwordData.currentPassword"
              type="password"
              placeholder="Enter your current password"
            />
          </div>
          <div class="space-y-2">
            <Label for="new-password">New Password</Label>
            <Input
              id="new-password"
              v-model="passwordData.newPassword"
              type="password"
              placeholder="Enter your new password"
            />
          </div>
          <div class="space-y-2">
            <Label for="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              v-model="passwordData.confirmPassword"
              type="password"
              placeholder="Confirm your new password"
            />
          </div>
        </div>
        <Button @click="changePassword" :disabled="changingPassword">
          {{ changingPassword ? 'Changing...' : 'Change Password' }}
        </Button>
      </CardContent>
    </Card>

    <!-- Two-Factor Authentication -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">🛡️</span>
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Enable 2FA</p>
            <p class="text-sm text-muted-foreground">
              {{ securityData.twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Add an extra layer of security' }}
            </p>
          </div>
          <Switch v-model="securityData.twoFactorEnabled" @update:model-value="toggle2FA" />
        </div>
        
        <div v-if="securityData.twoFactorEnabled" class="space-y-3">
          <div class="p-3 bg-muted rounded-lg">
            <p class="text-sm font-medium mb-2">Recovery Codes</p>
            <p class="text-sm text-muted-foreground mb-3">
              Save these codes in a safe place. You can use them to access your account if you lose your device.
            </p>
            <Button variant="outline" size="sm" @click="showRecoveryCodes">
              View Recovery Codes
            </Button>
          </div>
          
          <div class="p-3 bg-muted rounded-lg">
            <p class="text-sm font-medium mb-2">Authenticator App</p>
            <p class="text-sm text-muted-foreground mb-3">
              Use an authenticator app like Google Authenticator or Authy to generate codes.
            </p>
            <Button variant="outline" size="sm" @click="setupAuthenticator">
              Setup Authenticator
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Privacy Controls -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">🔒</span>
          Privacy Controls
        </CardTitle>
        <CardDescription>
          Manage your data sharing and privacy preferences
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Analytics Tracking</p>
              <p class="text-sm text-muted-foreground">
                Help us improve the app by sharing anonymous usage data
              </p>
            </div>
            <Switch v-model="securityData.analyticsTracking" />
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Crash Reporting</p>
              <p class="text-sm text-muted-foreground">
                Automatically send crash reports to help fix bugs
              </p>
            </div>
            <Switch v-model="securityData.crashReporting" />
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Marketing Communications</p>
              <p class="text-sm text-muted-foreground">
                Receive updates about new features and tips
              </p>
            </div>
            <Switch v-model="securityData.marketingCommunications" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Account Activity -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">📊</span>
          Account Activity
        </CardTitle>
        <CardDescription>
          Monitor your account activity and security events
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p class="font-medium">Last Login</p>
              <p class="text-sm text-muted-foreground">
                {{ securityData.lastLogin }}
              </p>
            </div>
            <Badge variant="secondary">Current Session</Badge>
          </div>
          
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p class="font-medium">Account Created</p>
              <p class="text-sm text-muted-foreground">
                {{ securityData.accountCreated }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p class="font-medium">Password Last Changed</p>
              <p class="text-sm text-muted-foreground">
                {{ securityData.passwordLastChanged }}
              </p>
            </div>
          </div>
        </div>
        
        <Button variant="outline" @click="viewAllActivity">
          View All Activity
        </Button>
      </CardContent>
    </Card>

    <!-- Data Management -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">📋</span>
          Data Management
        </CardTitle>
        <CardDescription>
          Manage your personal data and account information
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p class="font-medium">Download My Data</p>
              <p class="text-sm text-muted-foreground">
                Get a copy of all your data
              </p>
            </div>
            <Button variant="outline" size="sm" @click="downloadData">
              Download
            </Button>
          </div>
          
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p class="font-medium">Data Processing Information</p>
              <p class="text-sm text-muted-foreground">
                Learn how we process your data
              </p>
            </div>
            <Button variant="outline" size="sm" @click="viewDataProcessing">
              View Info
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Delete Account -->
    <Card class="border-destructive">
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-destructive">
          <span class="text-xl">⚠️</span>
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p class="text-sm font-medium text-destructive mb-2">Warning</p>
          <p class="text-sm text-muted-foreground">
            This action cannot be undone. All your habits, progress data, and account information will be permanently deleted.
          </p>
        </div>
        
        <div class="space-y-2">
          <Label for="delete-confirmation">Type "DELETE" to confirm</Label>
          <Input
            id="delete-confirmation"
            v-model="deleteConfirmation"
            placeholder="Type DELETE to confirm"
          />
        </div>
        
        <Button 
          variant="destructive" 
          @click="deleteAccount"
          :disabled="deleteConfirmation !== 'DELETE' || deletingAccount"
        >
          {{ deletingAccount ? 'Deleting...' : 'Delete Account' }}
        </Button>
      </CardContent>
    </Card>

    <!-- Save Button -->
    <div class="flex justify-end">
      <Button @click="saveSecuritySettings" :disabled="saving">
        <IconSave class="w-4 h-4 mr-2" />
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">

type PasswordData = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

type SecurityData = {
  twoFactorEnabled: boolean
  analyticsTracking: boolean
  crashReporting: boolean
  marketingCommunications: boolean
  lastLogin: string
  accountCreated: string
  passwordLastChanged: string
}

const passwordData = reactive<PasswordData>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const securityData = reactive<SecurityData>({
  twoFactorEnabled: false,
  analyticsTracking: true,
  crashReporting: true,
  marketingCommunications: false,
  lastLogin: 'Today at 2:30 PM',
  accountCreated: 'January 15, 2024',
  passwordLastChanged: '2 weeks ago'
})

const deleteConfirmation = ref('')
const saving = ref(false)
const changingPassword = ref(false)
const deletingAccount = ref(false)

function saveSecuritySettings() {
  saving.value = true
  // Simulate API call
  setTimeout(() => {
    saving.value = false
    // toast.success('Security settings saved successfully!')
  }, 1000)
}

function changePassword() {
  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    // toast.error('Please fill in all password fields')
    return
  }
  
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    // toast.error('New passwords do not match')
    return
  }
  
  changingPassword.value = true
  // Simulate API call
  setTimeout(() => {
    changingPassword.value = false
    passwordData.currentPassword = ''
    passwordData.newPassword = ''
    passwordData.confirmPassword = ''
    // toast.success('Password changed successfully!')
  }, 2000)
}

function toggle2FA(enabled: boolean) {
  if (enabled) {
    // toast.success('Two-factor authentication enabled')
  } else {
    // toast.success('Two-factor authentication disabled')
  }
}

function showRecoveryCodes() {
  // Simulate showing recovery codes
  console.log('Showing recovery codes...')
  // toast.success('Recovery codes displayed')
}

function setupAuthenticator() {
  // Simulate authenticator setup
  console.log('Setting up authenticator...')
  // toast.success('Authenticator setup initiated')
}

function viewAllActivity() {
  // Simulate viewing activity
  console.log('Viewing all activity...')
  // toast.success('Activity log opened')
}

function downloadData() {
  // Simulate data download
  console.log('Downloading data...')
  // toast.success('Data download initiated')
}

function viewDataProcessing() {
  // Simulate viewing data processing info
  console.log('Viewing data processing information...')
  // toast.success('Data processing info opened')
}

function deleteAccount() {
  if (deleteConfirmation.value !== 'DELETE') {
    // toast.error('Please type DELETE to confirm')
    return
  }
  
  deletingAccount.value = true
  // Simulate account deletion
  setTimeout(() => {
    deletingAccount.value = false
    // toast.success('Account deletion initiated')
    // In a real app, this would redirect to a confirmation page or logout
  }, 2000)
}
</script>

<style scoped></style>
