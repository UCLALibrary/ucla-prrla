pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        awsCodeBuild(projectName: 'prrla-artifact-build', credentialsId: 'PRRLA-CodeBuild-Trigger-User', region: 'us-west-2', credentialsType: 'jenkins')
      }
    }
  }
}