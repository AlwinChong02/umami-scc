pipeline {
    agent any
    stages {
        stage('Check Node and Install Yarn') {
            steps {
                script {
                    // Check if Node.js is installed
                    def nodeExists = bat(
                        script: '@node --version >nul 2>&1 && echo NODE_FOUND || echo NODE_NOT_FOUND',
                        returnStdout: true
                    ).trim().contains('NODE_FOUND')
                    
                    if (!nodeExists) {
                        error "Node.js is not installed. Please install Node.js before proceeding."
                    }
                    
                    // Get Node.js version for later use
                    def nodeVersion = bat(
                        script: '@node --version',
                        returnStdout: true
                    ).trim()
                    env.NODE_VERSION = nodeVersion
                    
                    // Check if npm is installed
                    def npmExists = bat(
                        script: '@npm --version >nul 2>&1 && echo NPM_FOUND || echo NPM_NOT_FOUND',
                        returnStdout: true
                    ).trim().contains('NPM_FOUND')
                    
                    if (!npmExists) {
                        error "npm is not installed. Please install npm before proceeding."
                    }
                    
                    // Check if yarn is installed
                    def yarnExists = bat(
                        script: '@yarn --version >nul 2>&1 && echo YARN_FOUND || echo YARN_NOT_FOUND',
                        returnStdout: true
                    ).trim().contains('YARN_FOUND')
                    
                    if (!yarnExists) {
                        echo "Yarn not found. Installing yarn globally..."
                        bat 'npm install -g yarn'
                    } else {
                        echo "Yarn is already installed."
                    }
                    
                    // Add npm global bin directory to PATH to ensure yarn is accessible
                    def npmBinPath = bat(
                        script: '@npm config get prefix',
                        returnStdout: true
                    ).trim()
                    
                    // Extract path from multiline output
                    def lines = npmBinPath.split('\n')
                    for (line in lines) {
                        if (line.contains('\\')) {
                            npmBinPath = line.trim()
                            break
                        }
                    }
                    
                    // Add the npm bin directory to PATH
                    def npmBinDir = "${npmBinPath}\\node_modules\\.bin;${npmBinPath}"
                    env.PATH = "${npmBinDir};${env.PATH}"
                    echo "Added npm global bin directory to PATH: ${npmBinDir}"
                    
                    // Show final yarn path for debugging
                    bat 'where yarn'
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
            echo "Build completed using Node.js ${env.NODE_VERSION}"
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