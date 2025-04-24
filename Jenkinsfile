pipeline {
    agent any

    stages {

        stage('Setup Yarn Path') {
            steps {
                script {
                    def yarnPath = bat(
                        script: 'for /f "tokens=*" %i in (\'where yarn\') do @echo %i',
                        returnStdout: true
                    ).trim()

                    env.PATH = "${yarnPath.substring(0, yarnPath.lastIndexOf('\\'))};${env.PATH}"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'yarn install'
            }
        }

        stage('Prepare Environment') {
            steps {
                writeFile file: '.env', text: 'DATABASE_URL=mysql://root:@localhost:3306/umami'
            }
        }

        stage('Build') {
            steps {
                bat 'yarn build'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'yarn test'
            }
        }
    }

    post {
        always {
            echo "Build completed using Node.js 22.13.1"
        }
        success{
            echo "Build succeeded"
            deleteDir()
        }
    }
}
