pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        awsCodeBuild(projectName: 'prrla-artifact-build', credentialsId: 'PRRLA-CodeBuild-Trigger-User', region: 'us-west-2', credentialsType: 'jenkins', sourceControlType: 'project')
      }
    }
    stage('Build') {
      steps {
        sh '''
        #!/bin/bash
        BUILD_DIR=/tmp/build-artifacts/prl
        mkdir -p $BUILD_DIR
        wget http://build-artifacts.library.ucla.edu/prl/test-prl-latest.tar.gz -O $BUILD_DIR/test-prl-latest.tar.gz
        wget http://build-artifacts.library.ucla.edu/prl/prod-prl-latest.tar.gz -O $BUILD_DIR/prod-prl-latest.tar.gz
        cd $BUILD_DIR; mkdir codedeploy; mv test-prl-latest.tar.gz codedeploy/; cd codedeploy; tar -zxf test-prl-latest.tar.gz; ls -la; cd ..
        rm -rf codedeploy
        cd $BUILD_DIR; mkdir codedeploy; mv prod-prl-latest.tar.gz codedeploy/; cd codedeploy; tar -zxf prod-prl-latest.tar.gz; ls -la; cd ..
        '''
      }
  }
}