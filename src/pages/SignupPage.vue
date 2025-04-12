<template>
  <q-card class="signup-card">
    <!-- Logo Container -->
    <div class="logo-container">
      <q-img src="src/assets/tagumlogo.png" class="logo" contain spinner-color="white" />
    </div>

    <!-- Header Section -->
    <q-card-section class="text-center header-section">
      <div class="text-h6 text-green-8 text-bold">City Accounting Office</div>
      <div class="text-caption text-gray" style="font-style: oblique">
        Electronic Registry of Appropriation and Commitment System (eRACS)
      </div>
    </q-card-section>

    <!-- Horizontal Stepper -->
    <q-stepper v-model="step" color="green" animated header-nav class="stepper-custom">
      <!-- Step 1: Personal Information -->
      <q-step :name="1" title="Personal Info" icon="person" :done="step > 1">
        <div class="row q-col-gutter-md">
          <!-- Left Column -->
          <div class="col-6">
            <div class="text-subtitle2 text-green-8 q-mb-xs">Fullname</div>
            <q-input
              outlined
              dense
              v-model="firstName"
              label="Firstname"
              color="green"
              class="q-mb-sm"
            />
            <q-input
              outlined
              dense
              v-model="middleName"
              label="Middlename"
              color="green"
              class="q-mb-sm"
            />
            <q-input
              outlined
              dense
              v-model="lastName"
              label="Lastname"
              color="green"
              class="q-mb-md"
            />

            <div class="text-subtitle2 text-green-8 q-mb-xs">Suffix (Optional)</div>
            <q-input outlined dense v-model="example" color="green" />
          </div>

          <!-- Right Column -->
          <div class="col-6">
            <div class="text-subtitle2 text-green-8 q-mb-xs">Barangay</div>
            <q-select
              outlined
              dense
              v-model="barangay"
              :options="barangayOptions"
              label="Select Barangay"
              color="green"
              class="q-mb-sm"
              emit-value
              map-options
              option-label="name"
              option-value="value"
            />
            <div class="text-subtitle2 text-green-8 q-mb-xs">Position</div>
            <q-input outlined dense v-model="position" color="green" class="q-mb-md" />

            <q-uploader
              url="/api/upload"
              label="Drag and drop photo or click to browse"
              accept=".jpg,.jpeg,.png,.gif"
              max-file-size="5242880"
              max-files="1"
              style="width: 100%"
              color="green"
              flat
              bordered
              @added="onFileAdded"
              @rejected="onFileRejected"
            >
              <template v-slot:header="scope">
                <div class="row no-wrap items-center q-pa-sm">
                  <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                  <div class="col">
                    <div class="q-uploader__title">Upload Photo</div>
                    <div class="q-uploader__subtitle">
                      {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
                    </div>
                  </div>
                  <q-btn v-if="scope.canAddFiles" icon="add" round dense flat color="white">
                    <q-uploader-add-trigger />
                  </q-btn>
                  <q-btn
                    v-if="scope.canRemoveFiles"
                    icon="clear"
                    round
                    dense
                    flat
                    color="red"
                    @click="scope.removeQueuedFiles"
                    class="q-ml-auto"
                  />
                </div>
              </template>

              <template v-slot:list="scope">
                <q-list separator>
                  <q-item v-for="file in scope.files" :key="file.name">
                    <q-item-section>
                      <q-item-label>{{ file.name }}</q-item-label>
                      <q-item-label caption>
                        {{ file.sizeLabel }} • {{ file.__statusLabel }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        icon="delete"
                        round
                        dense
                        flat
                        color="red"
                        @click="scope.removeFile(file)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>
            </q-uploader>
          </div>
        </div>

        <q-stepper-navigation class="row justify-between q-mt-md">
          <div class="text-caption text-gray">
            Already have an account?
            <span class="text-blue cursor-pointer" @click="goToSignUp">Sign in.</span>
          </div>
          <q-btn @click="step = 2" color="green" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <!-- Step 2: Account Credentials -->

      <q-step :name="2" title="Account Info" icon="lock" :done="step > 2">
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-input
              outlined
              dense
              v-model="email"
              label="Email"
              color="green"
              :rules="[(val) => !!val || 'Email is required']"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>
          </div>
          <div class="col-6">
            <q-input
              outlined
              dense
              v-model="username"
              label="Username"
              color="green"
              :rules="[(val) => !!val || 'Username is required']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-sm">
          <div class="col-6">
            <q-input
              outlined
              dense
              v-model="password"
              label="Password"
              type="password"
              color="green"
              :rules="[(val) => val.length >= 6 || 'Minimum 6 characters']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
          </div>
          <div class="col-6">
            <q-input
              outlined
              dense
              v-model="confirmPassword"
              label="Confirm Password"
              type="password"
              color="green"
              :rules="[
                (val) => !!val || 'Required',
                (val) => val === password || 'Passwords do not match',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
          </div>
        </div>

        <q-stepper-navigation class="row justify-between q-mt-md">
          <q-btn flat @click="step = 1" color="green" label="Back" />
          <q-btn @click="handleSubmit" color="green" label="Submit" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-card>
</template>

<script>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
const $q = useQuasar()

export default {
  data() {
    return {
      step: 1,
      firstName: '',
      middleName: '',
      lastName: '',
      barangay: null, // Initialize as null for the select
      barangayOptions: [
        // Moved to data() from submitForm
        { name: 'Apokon', value: 'Apokon' },
        { name: 'Bincungan', value: 'Bincungan' },
        { name: 'Busaon', value: 'Busaon' },
        { name: 'Canocotan', value: 'Canocotan' },
        { name: 'Cuambogan', value: 'Cuambogan' },
        { name: 'La Filipina', value: 'La Filipina' },
        { name: 'Liboganon', value: 'Liboganon' },
        { name: 'Madaum', value: 'Madaum' },
        { name: 'Magdum', value: 'Magdum' },
        { name: 'Mankilam', value: 'Mankilam' },
        { name: 'New Balamban', value: 'New Balamban' },
        { name: 'Nueva Fuerza', value: 'Nueva Fuerza' },
        { name: 'Pagsabangan', value: 'Pagsabangan' },
        { name: 'Pandapan', value: 'Pandapan' },
        { name: 'Magugpo Poblacion', value: 'Magugpo Poblacion' },
        { name: 'San Agustin', value: 'San Agustin' },
        { name: 'San Isidro', value: 'San Isidro' },
        { name: 'San Miguel', value: 'San Miguel' },
        { name: 'Visayan Village', value: 'Visayan Village' },
        { name: 'Magugpo East', value: 'Magugpo East' },
        { name: 'Magugpo North', value: 'Magugpo North' },
        { name: 'Magugpo South', value: 'Magugpo South' },
        { name: 'Magugpo West', value: 'Magugpo West' },
      ],
      position: '',
      example: '',
      photo: null,
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    }
  },
  methods: {
    submitForm() {
      console.log('Form submitted:', {
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        barangay: this.barangay, // Now correctly references the data property
        position: this.position,
        example: this.example,
        photo: this.photo,
        email: this.email,
        username: this.username,
        password: this.password,
      })
    },

    handleUpload() {
      if (this.photo) {
        console.log('Uploading file:', this.photo.name)
        // Add your file upload logic here
        // Example: this.uploadToServer(this.photo)
      }
    },
  },

  computed: {
    cardWidth() {
      return $q.screen.lt.sm ? '100%' : $q.screen.lt.md ? '80%' : '50%'
    },
  },

  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const handleSubmit = async () => {
      try {
        // Your registration logic here
        // await registerUser(userData)

        // Show success notification
        $q.notify({
          type: 'positive',
          message: 'Registered successfully!',
          position: 'top',
          timeout: 2500,
        })

        // Navigate to login
        router.push('/')
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Registration failed: ' + error.message,
        })
      }
    }

    return {
      handleSubmit,
    }
  },
}
</script>

<style scoped>
.signup-card {
  width: 700px;
  padding: 30px;
  border-radius: 10px;
  background: rgba(255, 255, 255);
  position: relative;
  box-shadow: 0 4px 8px rgb(38, 121, 0);
  margin-top: 110px;
  margin-bottom: 20px;
}

.header-section {
  margin-top: 30px;
  margin-bottom: 20px;
}

.text-gray {
  color: #666;
}

/* Custom stepper styles */
/*
.stepper-custom .q-stepper__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.stepper-custom .q-stepper__tab--active .q-stepper__title {
  font-weight: bold;
  color: var(--q-primary);
}

.stepper-custom .q-stepper__tab--active .q-stepper__dot {
  background: var(--q-primary);
}

/* Custom styling for the uploader */
.q-uploader {
  border-radius: 3px;
}

.q-uploader__title {
  color: var(--q-info);
}

.q-uploader__subtitle {
  font-size: 0.75rem;
  color: #e5e5e5;
}

/* Make it match your existing green theme */
</style>
