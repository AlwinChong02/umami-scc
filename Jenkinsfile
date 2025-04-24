pipeline {
    agent any
    stages {
        stage('Setup Package Manager') {
            steps {
                script {
                    // Check if yarn is available
                    def yarnExists = bat(
                        script: '@where yarn 2>nul && echo YARN_FOUND || echo YARN_NOT_FOUND',
                        returnStdout: true
                    ).trim().contains('YARN_FOUND')
                    
                    if (yarnExists) {
                        echo "Using yarn as package manager"
                        env.PACKAGE_MANAGER = 'yarn'
                    } else {
                        // Fall back to npm if yarn isn't available
                        def npmExists = bat(
                            script: '@where npm 2>nul && echo NPM_FOUND || echo NPM_NOT_FOUND',
                            returnStdout: true
                        ).trim().contains('NPM_FOUND')
                        
                        if (npmExists) {
                            echo "Yarn not found. Falling back to npm"
                            env.PACKAGE_MANAGER = 'npm'
                        } else {
                            error "Neither yarn nor npm found. Please install Node.js with npm"
                        }
                    }
                }
            }
        }
       
        stage('Install Dependencies') {
            steps {
                script {
                    if (env.PACKAGE_MANAGER == 'yarn') {
                        bat 'yarn install'
                    } else {
                        bat 'npm install'
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
                    if (env.PACKAGE_MANAGER == 'yarn') {
                        bat 'yarn build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    if (env.PACKAGE_MANAGER == 'yarn') {
                        bat 'yarn test'
                    } else {
                        bat 'npm test'
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
        failure {
            echo "Build failed"
        }
    }
}