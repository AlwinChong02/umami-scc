pipeline {
    agent any
    stages {
        stage('Setup Yarn Path') {
            steps {
                script {
                    // Windows-specific approach
                    def yarnPath = bat(
                        script: '@echo off && for /f "tokens=*" %%i in (\'where yarn\') do @echo %%i',
                        returnStdout: true
                    ).trim()
                    
                    // Check if yarn was found
                    if (yarnPath) {
                        // Extract the directory path and add to PATH
                        def yarnDir = yarnPath.substring(0, yarnPath.lastIndexOf('\\'))
                        env.PATH = "${yarnDir};${env.PATH}"
                        echo "Windows yarn path added to PATH: ${yarnDir}"
                    } else {
                        error "Yarn not found in PATH. Please ensure yarn is installed and available."
                    }
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
        success {
            echo "Build succeeded"
            deleteDir()
        }
    }
}