import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
// import SimpleStorage from '../../../../smartcontact/build/contracts/SimpleStorage.json';

@Component({
  selector: 'app-smartcontact',
  templateUrl: './smartcontact.component.html',
  styleUrls: ['./smartcontact.component.css']
})
export class SmartcontactComponent implements OnInit {
  balance: string = '-';
  value: string = '';
  account: string = '-';
  to: string = '';
  chainId: string = '-';
  constructor() {
    this.getAccount();
   }

  ngOnInit(): void {
  }

  getAccount = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      this.account = accounts[0];
      let provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const currentBalance = await provider.getBalance(address);
      this.balance = ethers.utils.formatEther(currentBalance).toString();
      const _chainId = await provider.getNetwork()
      this.chainId = _chainId.chainId.toString();
      // const contract = new ethers.Contract(address,SimpleStorage.abi,signer);
      // console.log(contract)
    }
  };

  connect = async () => {
    if (this.value && this.to) {
      if (typeof (window as any).ethereum !== 'undefined') {
        let provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        this.sentBusd(address);
      }
    } else {
      alert('Pleasกรุณากรอก Address to หรือจำนวนเหรียญ');
    }
  };

  sentBusd = async (address: any) => {
    let _value = this.value;
    let sum = parseFloat(_value) * 10000000000000;
    let params = [
      {
        from: address,
        to: this.to,
        value: sum.toString(),
        gasPrice: '20000000000',
        gas: '21000',
      },
    ];
    const sent = await (window as any).ethereum
      .request({ method: 'eth_sendTransaction', params: params })
      .then((result: any) => {
        if (result) {
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Send BUSD Success',
            });

            this.getAccount();
            this.value = '';
            this.to = '';
          }, 16000);
        }
      })
      .catch((error: any) => {
        this.value = '';
        this.to = '';
        if (error.code === 4001) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Reject Send',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          });
        }
      });
  };
}
