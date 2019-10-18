pipeline {
  agent any
  environment {
    APP_ENV = "test-prl"
  }
  stages {
    stage('Build and deploy PRRLA Code') {
      steps {
        awsCodeBuild(
        projectName: "prrla-artifact-build",
        credentialsId: "PRRLA-CodeBuild-Trigger-User",
        region: "us-west-2",
        credentialsType: "jenkins",
        sourceControlType: "project",
        sourceVersion: "LEG-151",
        envVariables: "[ { APP_ENV, ${APP_ENV} } ]"
        )
      }
    }
    stage('Check $APP_ENV site for errors') {
      steps {
        sh '''
        if [[ ${APP_ENV} == "prod-prl" ]]
        then
          if curl -s https://prl.library.ucla.edu | grep -i prrla
          then
            exit 0
          else
            exit 1
          fi
        else
          if curl -s https://${APP_ENV}.library.ucla.edu | grep -i prrla
          then
            exit 0
          else
            exit 1
          fi
        fi
        '''
      }
    }
  }
  post {
    always {
      // send build result notifications
      slackSend (
      channel: "#code_deployment",
      color: "#FFFF00",
      message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} ${currentBuild.currentResult} after ${currentBuild.durationString.replace(' and counting', '')} (<${env.RUN_DISPLAY_URL}|open>)\nEnvironment: ${APP_ENV}.library.ucla.edu",
      tokenCredentialId: "3f977f85-c455-4a52-9f84-e84122360849",
      teamDomain: "uclalibrary"
      )
    }
  }
}
