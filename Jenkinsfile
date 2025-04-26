pipeline {
    agent any
    
    environment {
        // Define Node.js version to install
        NODE_VERSION = '18.18'  // LTS version that's stable
        NODE_INSTALLER = 'node-v${NODE_VERSION}-x64.msi'
        NODE_URL = "https://nodejs.org/dist/v${NODE_VERSION}/${NODE_INSTALLER}"
        TEMP_DIR = "${WORKSPACE}\\temp"
    }
    
    stages {
        stage('Setup Environment') {
            steps {
                script {
                    // Create temporary directory
                    bat "mkdir ${TEMP_DIR} || echo Directory already exists"
                    
                    // Check if Node.js is already installed
                    def nodeInstalled = bat(
                        script: 'node --version >nul 2>&1 && echo Node_Installed || echo Node_Missing',
                        returnStdout: true
                    ).trim().contains('Node_Installed')
                    
                    if (!nodeInstalled) {
                        echo "Downloading and installing Node.js ${NODE_VERSION}..."
                        
                        // Download Node.js installer
                        bat "curl -o ${TEMP_DIR}\\${NODE_INSTALLER} ${NODE_URL}"
                        
                        // Install Node.js silently (will also install npm)
                        bat "msiexec /i ${TEMP_DIR}\\${NODE_INSTALLER} /qn"
                        
                        // Allow time for installation to complete
                        sleep 30
                        
                        // Add Node.js to PATH for this session
                        env.PATH = "C:\\Program Files\\nodejs;${env.PATH}"
                    } else {
                        echo "Node.js is already installed"
                    }
                    
                    // Verify Node.js and npm installation
                    bat 'node --version'
                    bat 'npm --version'
                    
                    // Install yarn globally
                    echo "Installing yarn globally..."
                    bat 'npm install -g yarn'
                    
                    // Verify yarn installation
                    bat 'yarn --version'
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

        stage('Deploy') {
            steps {
                echo "Deploying application..."
                // Add deployment steps here
                bat 'docker-compose up -d'
            }
        }
    }
    
    post {
        always {
            script {
                def nodeVersion = bat(
                    script: 'node --version',
                    returnStdout: true
                ).trim()
                echo "Build completed using Node.js ${nodeVersion}"
                
                // Clean up temporary files
                bat "rmdir /s /q ${TEMP_DIR} || echo No temp directory to clean"
            }
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