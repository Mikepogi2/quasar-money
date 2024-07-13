<template>
  <q-page>
    <div class="q-pa-md">
      <q-list separator :bordered="$p.entries.length > 0">
        <transition-group appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut">
          <q-slide-item @right="onRight($event, entry)" @left="onLeft($event, entry)" v-for="entry in $p.entries " :key="entry.id" left-color="positive" right-color="negative" transition-hide="slide-down">
              <template v-slot:right>
                <q-icon name="delete" />
              </template>
              <template v-slot:left>
                <q-icon name="done" />
              </template>
            <q-item>
              <q-item-section :class="[colorClass(entry.amount), { 'line-through': entry.isPaid }]" class="text-weight-bold">
                {{ entry.name }}
                <q-popup-edit v-model="entry.name" auto-save v-slot="scope1">
                  <q-input v-model="scope1.value" dense autofocus counter @keyup.enter="scope1.set" />
                </q-popup-edit>
              </q-item-section>

              <q-item-section side :class="[colorClass(entry.amount), { 'line-through': entry.isPaid }]" class="text-weight-bold">
                {{ currencify(entry.amount) }}
                <q-popup-edit v-model="entry.amount" auto-save v-slot="scope">
                  <q-input type="number" v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                </q-popup-edit>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </transition-group>
      </q-list>

      <transition 
        appear
        enter-active-class="animated bounceIn slower"
        leave-active-class="animated bounceOut slower"
      >
        <Nothing v-if="$p.entries.length == 0" class="q-mt-xl"/>
      </transition>

    </div>


    <q-footer class="bg-transparent">
      <transition
        appear
        enter-active-class="animated slideInUp slow"
        leave-active-class="animated slideOutDown slow"
      >   
        <div class="row q-mb-sm q-px-md q-py-sm shadow-up-3 items-center" v-if="$p.balance !== 0">
          <div class="col text-grey-7 text-h6">
            Balance:
          </div>
          <div class="col text-h6 text-right" :class="colorClass($p.balance)">
            {{ currencify($p.balance) }}
            <div class="text-caption text-weight-bold" :class="colorClass($p.paid)">
                Paid: {{ currencify($p.paid) }}
            </div>
          </div>
        </div>
      </transition>

      <q-form @submit="addExpense" class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary">
        <div class="col">
          <q-input outlined placeholder="Name" bg-color="white" dense v-model="$p.textAmount" required ref="reFocus"/>
        </div>
        <div class="col">
          <q-input type="number" outlined placeholder="Amount" bg-color="white" dense input-class="text-right" step="0.01" v-model="$p.numAmount" required/>
        </div>
        <div class="col col-auto">
          <q-btn push round icon="add" type="submit"/>
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup>
import { ref, watch} from 'vue';
import { currencify } from 'src/use/currencify';
import { colorClass } from 'src/use/colorClass';
import { useQuasar } from 'quasar';
import { usePiniaStore } from 'src/stores/example-store';
import  Nothing  from 'components/Nav/Nothing.vue'

const $p = usePiniaStore()
const $q = useQuasar()
const reFocus = ref(null)

const addExpense = () => {
  $p.addExpense()
  reFocus.value.focus()
}

const onRight = ({ reset }, entry) => {
  $q.dialog({
        title: 'Confirm',
        message: `Delete this entry?
          <div class="q-mt-md text-weight-bold ${ colorClass(entry.amount) }" >
          ${ entry.name } : ${ currencify(entry.amount) }
          </div>
        
        `,
        cancel: true,
        persistent: true,
        html: true,
        ok: {
          label: 'Delete',
          color: 'negative',
          noCaps: true
        },
        cancel: {
          color: 'primary',
          noCaps: true
        }
      }).onOk(() => {
         $p.deleteEntry(entry.id)
         $q.notify({
          message: 'Entry Deleted',
          position: 'top',
          color: 'negative',
          classes: 'text-weight-bold'
        })
      }).onCancel(() => {
         reset()
      })
}

const onLeft = ({ reset }, entry) => {
  entry.isPaid = !entry.isPaid
  reset()
}

const SaveData = $q.localStorage.getItem('$p.entries')
if (SaveData) Object.assign($p.entries, SaveData)

watch($p.entries, value => {
  console.log(value)
  $q.localStorage.set('$p.entries', value)
})

</script>

<style scoped>

.line-through {
  text-decoration: line-through;
}

</style>
