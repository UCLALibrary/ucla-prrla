pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        awsCodeBuild(projectName: 'prrla-artifact-build', credentialsId: 'PRRLA-CodeBuild-Trigger-User', region: 'us-west-2', credentialsType: 'jenkins', sourceControlType: 'project')
      }
    }
    stage('Prepare deploy space') {
      steps {
        sh '''
        #!/bin/bash
        BUILD_DIR=/tmp/build-artifacts/prl
        mkdir -p $BUILD_DIR
        '''
      }
    }
    stage('Deploy to test site') {
      steps {
        sh '''
        wget http://build-artifacts.library.ucla.edu/prl/test-prl-latest.tar.gz -O $BUILD_DIR/test-prl-latest.tar.gz
        cd $BUILD_DIR; mkdir codedeploy; mv test-prl-latest.tar.gz codedeploy/; cd codedeploy; tar -zxf test-prl-latest.tar.gz; ls -la; cd ..
        rm -rf codedeploy
        '''
      }
    }
  }
}