<template>
  <div class="relative w-screen h-screen bg-base-300 cursor-default select-none">
    <!-- ReceiptWindow -->
    <div v-if="receiptWindow"
      :class="[ePay ? 'h-[13rem] -translate-y-3/4' : 'h-[35rem] -translate-y-1/2 overflow-y-scroll custom-scrollbar']"
      class="animate-fade absolute bg-base-100 w-[13rem] z-40 shadow-xl border border-white rounded-xl top-1/2 left-1/2 -translate-x-1/2 flex justify-center">
      <div>
        <!-- Title -->
        <p class="text-success text-center text-3xl font-bold border-b-2 border-white">Receipt</p>
        <div class="mt-2 flex justify-center">
          <!-- ePayInfo -->
          <div>
            <!-- PaymentMethod -->
            <p class="text-xl text-center"><span v-if="ePay" class="text-secondary font-bold">E-Money</span> <span
                v-if="cPay" class="text-primary font-bold">Cash</span> Payment</p>
            <!-- Info -->
            <div class="flex justify-center">
              <div class="mt-2 w-[8rem]">
                <div class="flex justify-between items-center border-b border-white">
                  <p>Tickets</p>
                  <p>{{ tickets }}</p>
                </div>
                <div class="flex justify-between items-center border-b border-white">
                  <p>Total</p>
                  <p>¥{{ totalTickets }}</p>
                </div>
                <div v-if="cPay">
                  <!-- Paid -->
                  <p class="mt-3 text-xl text-center font-bold">Paid</p>
                  <div class="mt-2 text-lg w-[8rem]">
                    <div v-for="item in pay" :key="item"
                      class="flex justify-between items-center border-b border-white">
                      <p>¥{{ item[0] }}</p>
                      <p>{{ item[1] }}</p>
                    </div>
                    <div class="flex justify-between items-center text-xl">
                      <p>Total</p>
                      <p>¥{{ totalPay }}</p>
                    </div>
                  </div>
                  <!-- Change -->
                  <p class="mt-3 text-xl text-center font-bold">Change</p>
                  <div class="mt-2 text-lg w-[8rem]">
                    <div v-for="item in change" :key="item"
                      class="flex justify-between items-center border-b border-white">
                      <p>¥{{ item[0] }}</p>
                      <p>{{ item[1] }}</p>
                    </div>
                    <div class="flex justify-between items-center text-xl">
                      <p>Total</p>
                      <p>¥{{ totalChange }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Exit -->
        <div class="mt-4 flex justify-center items-center">
          <button @click="initializeState()" class="btn btn-sm w-16 shadow">Exit</button>
        </div>
      </div>
    </div>
    <!-- Title -->
    <div class="pt-4 flex justify-center items-center">
      <button @click="resetAll()"
        class="text-white text-4xl font-bold btn btn-accent btn-lg w-max shadow-xl tooltip tooltip-bottom tooltip-info"
        data-tip="Reload App">SomeWhere-Station</button>
    </div>
    <!-- Main -->
    <div class="mt-5 relative flex justify-center">
      <!-- TicketMachine -->
      <div>
        <!-- Title -->
        <p class="text-white text-center font-bold text-2xl">Ticket Machine</p>
        <div
          class="mt-1 border border-white bg-base-100 w-[20rem] rounded-xl shadow-xl relative flex justify-center items-center"
          :class="[cPay ? 'h-[35rem] animate-fade' : 'h-[13.5rem]']">
          <!-- Reset -->
          <div class="absolute right-2 top-1.5">
            <button @click="initializeState()" class="btn btn-error btn-xs">Reset</button>
          </div>
          <div>
            <!-- SelectTicket -->
            <div class="mt-2 flex justify-center items-center border-b-2 border-white">
              <p class="font-bold text-2xl">Choose your Ticket</p>
            </div>
            <div class="mt-3 flex justify-around items-center space-x-3">
              <div v-if="cPay || !ePay">
                <button @click="changePay('cPay')" class="btn btn-primary h-[5rem] w-[7.5rem] shadow">
                  <div class="text-xl">
                    <p>Cash</p>
                    <p>¥130</p>
                  </div>
                </button>
              </div>
              <div v-if="ePay || !cPay">
                <button @click="changePay('ePay')" class="btn btn-secondary h-[5rem] w-[7.5rem] shadow">
                  <div class="text-xl">
                    <p>e-money</p>
                    <p>¥124</p>
                  </div>
                </button>
              </div>
            </div>
            <!-- Number Of Tickets -->
            <div v-if="ePay || cPay" class="pt-4 flex justify-center items-center text-xl font-bold">
              <p>Tickets</p>
              <input class="w-16 ml-3 border border-black rounded text-center invalid:border-error" type="number"
                v-model="tickets" max="140" min="1">
            </div>
            <!-- Select Amount -->
            <div v-if="cPay" class="mt-5">
              <p class="text-center text-2xl font-bold border-b-2 border-white">Cash Payment</p>
              <div class="mt-3 flex justify-center">
                <div class="space-y-2">
                  <div class="space-x-6" v-for="(item, index) in pay" :key="item">
                    <button @click="plusPay(index)" class="btn btn-neutral btn-sm w-20 h-7 shadow">¥{{ item[0]
                    }}</button>
                    <input class="w-12 h-7 border border-black rounded text-center invalid:border-error" type="number"
                      :max="cash[index][1]" min="0" v-model="item[1]">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Buy Screen -->
        <div v-if="ePay || cPay" class="flex animate-fade justify-center items-center mt-4 space-x-2">
          <div
            class="flex justify-center items-center bg-base-100 w-[15rem] h-[4rem] border border-white rounded-xl shadow-xl text-2xl font-bold">
            <p>Total</p>
            <div v-if="ePay" :class="[overEMoney ? 'text-error' : 'text-black']" class="flex ml-5 space-x-1">
              <p>¥{{ totalTickets }}</p>
            </div>
            <div v-if="cPay" :class="[overCash ? 'text-error' : 'text-black']" class="flex ml-1 space-x-1">
              <p :class="{ 'text-error': enoughPay }">¥{{ totalPay }}/</p>
              <p>{{ totalTickets }}</p>
            </div>
          </div>
          <!-- Submit Buy -->
          <div class="animate-fade" v-if="!overEMoney && !overCash && !enoughPay && !overPaid">
            <button @click="submitBuy()" class="btn btn-success text-xl h-[4rem] w-18 shadow-xl">
              Buy
            </button>
          </div>
        </div>
      </div>
      <!-- UserMoney -->
      <div class="ml-24">
        <!-- User EMoney -->
        <div>
          <p class="text-white text-center font-bold text-2xl">Your E-Money</p>
          <div :class="[overEMoney ? 'bg-error text-white' : 'bg-base-100 text-black']"
            class="mt-1 border border-white bg-base-100 w-[12rem] h-[3rem] rounded-xl shadow-xxl px-1 py-1 flex justify-center items-center">
            <p class="text-3xl font-bold">¥{{ eMoney }}</p>
          </div>
        </div>
        <!-- User Cash -->
        <div class="mt-7">
          <p class="text-white text-center font-bold text-2xl">Your Cash</p>
          <div class="border border-white bg-base-100 mt-1 w-[12rem] h-[33rem] rounded-xl shadow-xl px-1 py-1">
            <div class="mt-3 flex justify-center">
              <table class="table table-zebra text-center">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Number</th>
                  </tr>
                </thead>
                <tbody class="border border-white/50">
                  <tr v-for="item in cash" :key="item">
                    <td>¥{{ item[0] }}</td>
                    <td>{{ item[1] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div :class="[overCash ? 'bg-error text-white' : 'bg-base-100 text-black']"
              class="mt-3 flex justify-center text-2xl font-bold space-x-5 rounded">
              <p>Total</p>
              <p>¥{{ totalCash }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      receiptWindow: false,
      cash: [
        [10000, 1],
        [5000, 1],
        [1000, 1],
        [500, 1],
        [100, 2],
        [50, 3],
        [10, 15]
      ],
      eMoney: 1000,
      cPay: false,
      ePay: false,
      tickets: 0,
      pay: [],
      overEMoney: false,
      enoughPay: false,
      overCash: false,
      change: []
    }
  },
  computed: {
    totalCash() {
      return this.calTotal(this.cash);
    },
    totalPay() {
      return this.calTotal(this.pay);
    },
    totalChange() {
      return this.calTotal(this.change);
    },
    totalTickets() {
      let total = 0;
      if (this.ePay) {
        total = this.tickets * 124;
        this.overEMoney = (total > this.eMoney) ? true : false;
      } else {
        total = this.tickets * 130;
        this.enoughPay = (total > this.totalPay) ? true : false;
        this.overCash = (total > this.totalCash) ? true : false;
      }
      return total;
    },
    overPaid() {
      let result = false;
      this.pay.forEach((e, index) => {
        const num = this.cash[index][1];
        if (e[1] > num) {
          result = true;
        }
      });
      return result;
    }
  },
  methods: {
    initializeMoney() {
      const arr = [
        [10000, 0],
        [5000, 0],
        [1000, 0],
        [500, 0],
        [100, 0],
        [50, 0],
        [10, 0],
      ]
      this.pay = JSON.parse(JSON.stringify(arr));
      this.change = JSON.parse(JSON.stringify(arr));
    },
    calTotal(d) {
      let total = 0;
      d.forEach(v => {
        total += v[0] * v[1];
      });
      return total;
    },
    changePay(d) {
      this[d] = true;
      this.tickets++;
    },
    plusPay(index) {
      if (this.pay[index][1] !== this.cash[index][1]) {
        this.pay[index][1]++;
      }
    },
    submitBuy() {
      if (this.ePay) {
        this.eMoney -= this.totalTickets;
      } else {
        this.pay.forEach((v, index) => {
          this.cash[index][1] -= v[1];
        });
        if (this.totalPay > this.totalTickets) {
          let total = this.totalPay - this.totalTickets;
          while (total !== 0) {
            for (let i = 0; i < 7; i++) {
              const amount = this.cash[i][0];
              if (total >= amount) {
                total -= amount;
                this.cash[i][1]++;
                this.change[i][1]++;
                break;
              }
            }
          }
        }
      }
      this.receiptWindow = true;
    },
    initializeState() {
      this.tickets = 0;
      this.initializeMoney();
      this.overEMoney = this.enoughPay = this.overCash = this.cPay = this.ePay = this.receiptWindow = false;
    },
    resetAll() {
      location.reload();
    }
  },
  created() {
    this.initializeMoney();
  }
}
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
  height: 1px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  display: none;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #000000;
  border-radius: 10px;
}
</style>