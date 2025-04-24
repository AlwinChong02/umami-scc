pipeline {
    agent any
    stages {
        stage('Setup Yarn Path') {
            steps {
                script {
                    // Cross-platform approach to find yarn
                    if (isUnix()) {
                        // Unix-based systems (Linux, macOS)
                        def yarnPath = sh(
                            script: 'which yarn',
                            returnStdout: true
                        ).trim()
                        // Add the directory containing yarn to PATH
                        env.PATH = "${yarnPath.substring(0, yarnPath.lastIndexOf('/'))}" + ":" + env.PATH
                        echo "Unix yarn path added to PATH: ${yarnPath.substring(0, yarnPath.lastIndexOf('/'))}"
                    } else {
                        // Windows
                        def yarnPath = bat(
                            script: '@for /f "tokens=*" %i in (\'where yarn 2^>nul\') do @echo %i',
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
        }
       
        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'yarn install'
                    } else {
                        bat 'yarn install'
                    }
                }
            }
        }
        stage('Prepare Environment') {
            steps {
                writeFile file: '.env', text: 'DATABASE_URL=mysql://root:@localhost:3306/umami'
            }
        }
        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'yarn build'
                    } else {
                        bat 'yarn build'
                    }
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'yarn test'
                    } else {
                        bat 'yarn test'
                    }
                }
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