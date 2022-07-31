import { Component, OnInit } from '@angular/core';
import { ethers, BigNumber } from 'ethers';
import Swal from 'sweetalert2';
import SimpleStorage from '../../../../smart_contact/build/contracts/SimpleStorage.json';

@Component({
  selector: 'app-smartcontact',
  templateUrl: './smartcontact.component.html',
  styleUrls: ['./smartcontact.component.css'],
})
export class SmartcontactComponent implements OnInit {
  balance: string = '-';
  value: string = '';
  account: string = '-';
  to: string = '';
  chainId: string = '-';
  count: string = '';
  constructor() {
    this.getAccount();
  }

  ngOnInit(): void {}

  getAccount = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.account = accounts[0];
      let provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      const getTransactionCount = await (window as any).ethereum.request({
        method: 'eth_getTransactionCount',
        params: [accounts[0], 'latest'],
      });
      this.count = Number(getTransactionCount).toString();
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const currentBalance = await provider.getBalance(address);
      this.balance = ethers.utils.formatEther(currentBalance).toString();
      const _chainId = await provider.getNetwork();
      this.chainId = _chainId.chainId.toString();
      const networksId = await (window as any).ethereum.request({
        method: 'net_version',
      });

      const contract = new ethers.Contract(
        SimpleStorage.networks[networksId].address,
        SimpleStorage.abi,
        signer
      );
    }
  };

  connect = async () => {
    if (this.value && this.to) {
      if (typeof (window as any).ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        let _value = this.value;
        const input = _value.toString().trim();
        const amount = ethers.utils.parseUnits(input, 18);
        this.sentBusd(address, amount._hex, provider);
      }
    } else {
      alert('Pleasกรุณากรอก Address to หรือจำนวนเหรียญ');
    }
  };

  sentBusd = async (address: any, amout: string, provider: any) => {
    let params = [
      {
        from: address,
        to: this.to,
        value: amout,
        // gasPrice: '20000000000',
        // gas: '21000',
      },
    ];
    const sent = await (window as any).ethereum
      .request({ method: 'eth_sendTransaction', params: params })
      .then((result: any) => {
        if (result) {
          if (this.checkTransactionConfirm(result)) {
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: 'Send BUSD Success',
              });
              this.getAccount();
              this.value = '';
              this.to = '';
            }, 17000);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something wrong !',
            });
          }
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

  checkTransactionConfirm = async (hax) => {
    await (window as any).ethereum
      .request({ method: 'eth_getTransactionReceipt', params: [hax] })
      .then((o) => {
        if (o != null) {
          return true;
        } else {
          return false;
        }
      });
  };
}
