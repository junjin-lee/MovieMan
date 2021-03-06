import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import * as wilddog from "wilddog";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signup: { email: string, password: string, verification: string };

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.signup = {email: '', password: '', verification: ''};
  }

  onSignup() {
    let pattern = /^([a-zA-Z0-9]+[-_\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,18})+$/;
    if (this.signup.email === '' || this.signup.password === '' || this.signup.verification === '') {
      this.presentToast('输入信息不能为空');
    } else if (!pattern.test(this.signup.email)) {
      this.presentToast('邮箱地址格式不正确');
    } else if (this.signup.password !== this.signup.verification) {
      this.presentToast('两次输入的密码不一致');
    } else if (this.signup.password.length < 6 || this.signup.password.length > 32) {
      this.presentToast('密码长度必须在 6 到 32 位之间');
    } else {
      wilddog.auth().createUserWithEmailAndPassword(this.signup.email, this.signup.password).then(user => {
        user.sendEmailVerification().then(() => {
          this.presentConfirmToast('已发送邮箱验证邮件到您的注册邮箱，请立即点击邮箱验证链接完成验证！');
        }, error => {
          this.presentToast(error.name + ': ' + error.message);
        });
      }, error => {
        this.presentToast(error.name + ': ' + error.message);
      });
    }
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({message: message, duration: 1500, dismissOnPageChange: true});
    toast.present().then(value => {
      return value;
    });
  }

  presentConfirmToast(message: string) {
    let toast = this.toastCtrl.create({message: message, showCloseButton: true, closeButtonText: "确认"});
    toast.onDidDismiss(() => {
      this.navCtrl.popToRoot().then(value => {
        return value;
      });
    });
    toast.present().then(value => {
      return value;
    });
  }
}
