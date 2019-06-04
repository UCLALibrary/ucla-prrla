pipeline {
  agent any
  environment {
    AWS_ACCESS_KEY_ID     = credentials('prrla-aws-access-key')
    AWS_SECRET_ACCESS_KEY = credentials('prrla-aws-secret-access-key')
    PACKAGE_SOURCE        = "http://build-artifacts.library.ucla.edu/prl"
    PROD_WEB_URL          = "prl.library.ucla.edu"
    TEST_WEB_URL          = "test-prl.library.ucla.edu"
    TEST_WEB_PACKAGE      = "test-prl-latest.tar.gz"
    PROD_WEB_PACKAGE      = "prod-prl-latest.tar.gz"
    BUILD_DIR             = "/tmp/build-artifacts/prl"
  }
  stages {
    stage('Build') {
      steps {
        awsCodeBuild(projectName: 'prrla-artifact-build', credentialsId: 'PRRLA-CodeBuild-Trigger-User', region: 'us-west-2', credentialsType: 'jenkins', sourceControlType: 'project')
      }
    }
    stage('Deploy to test site') {
      steps {
        sh '''
        mkdir -p $BUILD_DIR
        wget $PACKAGE_SOURCE/$TEST_WEB_PACKAGE -O $BUILD_DIR/$TEST_WEB_PACKAGE
        cd $BUILD_DIR; mkdir codedeploy; mv $TEST_WEB_PACKAGE codedeploy/; cd codedeploy; tar -zxf $TEST_WEB_PACKAGE; rm $TEST_WEB_PACKAGE
        echo "User-agent: *\nDisallow: /" > robots.txt
        cd ..
        aws s3 sync codedeploy/ s3://$TEST_WEB_URL --delete
        rm -rfv $BUILD_DIR
        '''
      }
    }
    stage('Ready for prod deploy') {
      steps {
        input('Do you want to deploy to prod?')
      }
    }
    stage('Deploy to prod site') {
      steps {
        sh '''
        mkdir -p $BUILD_DIR
        wget $PACKAGE_SOURCE/$PROD_WEB_PACKAGE -O $BUILD_DIR/$PROD_WEB_PACKAGE
        cd $BUILD_DIR; mkdir codedeploy; mv $PROD_WEB_PACKAGE codedeploy/; cd codedeploy; tar -zxf $PROD_WEB_PACKAGE; rm $PROD_WEB_PACKAGE
        cd ..
        aws s3 ls
        rm -rfv $BUILD_DIR
        '''
      }
    }
 
  }
}