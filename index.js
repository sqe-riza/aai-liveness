import React, { Component } from 'react';
import { StyleSheet, requireNativeComponent, NativeModules, NativeEventEmitter, UIManager, findNodeHandle} from 'react-native';


export default class AAIIOSLivenessSDK {

  static initSDKByLicense(market, isGlobalService) {
    NativeModules.RNAAILivenessSDK.initSDKByLicense(market, isGlobalService)
  }

  static initSDKByKey(accessKey, secretKey, market, isGlobalService) {
    NativeModules.RNAAILivenessSDK.initSDKByKey(accessKey, secretKey, market, isGlobalService)
  }

  static setDetectOcclusion(detectOcclusion) {
    NativeModules.RNAAILivenessSDK.setDetectOcclusion(detectOcclusion)
  }

  static setResultPictureSize(pictureSize) {
    NativeModules.RNAAILivenessSDK.setResultPictureSize(pictureSize)
  }

  static setActionTimeoutSeconds(actionTimeout) {
    NativeModules.RNAAILivenessSDK.setActionTimeoutSeconds(actionTimeout)
  }

  static setActionSequence(shuffle, actionSequence) {
    NativeModules.RNAAILivenessSDK.setActionSequence(shuffle, actionSequence)
  }

  static setDetectionLevel(level) {
    NativeModules.RNAAILivenessSDK.setDetectionLevel(level)
  }

  static bindUser(userId) {
    NativeModules.RNAAILivenessSDK.bindUser(userId)
  }

  static setLicenseAndCheck(license, callback) {
    NativeModules.RNAAILivenessSDK.setLicenseAndCheck(license, callback)
  }

  static _sdkEventListener = null
  static _callback = {}

  // Callback
  static _sdkEventCallback = {
    onCameraPermission: (errorInfo) => {
      if (errorInfo && !errorInfo.authed) {
        // Permission denied
        // {"key": "xxx", "message": "xxx"}
        if (this._callback.onCameraPermissionDenied) {
            this._callback.onCameraPermissionDenied(errorInfo.key, errorInfo.message)
        }            
      }

      if (this._sdkEventListener) {
        this._sdkEventListener.remove()
      }
    },
    onDetectionReady: (info) => {
      // {"key": "xxx", "message": "xxx", "state": "xxx"}
      //  console.log('onDetectionReady: ', info)
    },
    onFrameDetected: (info) => {
      // {"key": "xxx", "state": "xxx"}
      // console.log('onFrameDetected: ', info)
    },
    onDetectionTypeChanged: (info) => {
      // {"key": "xxx", "state": "xxx"}
      // console.log('onDetectionTypeChanged: ', info)
    },
    onDetectionComplete: (info) => {
      // {"livenessId": "xxx", "img": "xxx", "transactionId": "xxx"}
      if (typeof(this._callback.onDetectionComplete) === "function") {
        this._callback.onDetectionComplete(info.livenessId, info.img)
      }

      if (this._sdkEventListener) {
        this._sdkEventListener.remove()
      }
    },
    onDetectionFailed: (errorInfo) => {
        // Show alert view
        // {"key": "xxx", "message": "xxx", "state": "xxx"}
        if (typeof(this._callback.onDetectionFailed) === "function") {
          this._callback.onDetectionFailed(errorInfo.key, errorInfo.message)
        }

        if (this._sdkEventListener) {
          this._sdkEventListener.remove()
        }
      },
    livenessViewBeginRequest: (info) => {
      // Show loading view
      if (typeof(this._callback.livenessViewBeginRequest) === "function") {
        this._callback.livenessViewBeginRequest()
      }
    },
    onLivenessViewRequestFailed: (errorInfo) => {
      // Auth request failed
      // {"code": integer, "message": "xxx", "transactionId": "xxx"}
      if (typeof(this._callback.onLivenessViewRequestFailed) === "function") {
        this._callback.onLivenessViewRequestFailed(errorInfo.code, errorInfo.message, errorInfo.transactionId)
      }

      if (this._sdkEventListener) {
        this._sdkEventListener.remove()
      }
    },
    livenessViewEndRequest: (errorInfo) => {
      // Close loading view
      // {}
      if (typeof(this._callback.livenessViewEndRequest) === "function") {
        this._callback.livenessViewEndRequest()
      }
    },
    onGiveUp: () => {
      if (typeof(this._callback.onGiveUp) === "function") {
        this._callback.onGiveUp()
      }

      if (this._sdkEventListener) {
        this._sdkEventListener.remove()
      }
      
    }
  }

  static startLiveness(config, callback) {
    this._callback = callback

    const sdkEmitter = new NativeEventEmitter(NativeModules.RNAAILivenessSDKEvent);
    this._sdkEventListener = sdkEmitter.addListener('RNAAILivenessSDKEvent', (info) => {
      this._sdkEventCallback[info.name](info.body)
    });
    
    NativeModules.RNAAILivenessSDK.startLiveness(config)
  }

  static sdkVersion(callback) {
    NativeModules.RNAAILivenessSDK.sdkVersion(callback)
  }
}
