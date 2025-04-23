pipeline {
    agent any

    environment {
        SKIP_DB_CHECK = '1'
    }

    parameters {
        choice(name: 'NODE_VERSION', choices: ['18.18'], description: 'Node.js Version')
        choice(name: 'DB_TYPE', choices: ['postgresql', 'mysql'], description: 'Database Type')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/AlwinChong02/umami-scc.git'
            }
        }

        stage('Set Node Version') {
            steps {
                bat '''
                if not exist "%USERPROFILE%\nodejs" (
                  curl -o nodejs.zip https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-win-x64.zip
                  powershell -Command "Expand-Archive nodejs.zip -DestinationPath %USERPROFILE%\nodejs"
                  move %USERPROFILE%\nodejs\node-v%NODE_VERSION%-win-x64 %USERPROFILE%\nodejs\node-v%NODE_VERSION%
                )
                set PATH=%USERPROFILE%\nodejs\node-v%NODE_VERSION%;%PATH%
                node --version
                '''
            }
        }

        stage('Install Yarn') {
            steps {
                bat 'npm install --global yarn'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'yarn install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'yarn test'
            }
        }

        stage('Build') {
            steps {
                sh 'yarn build'
            }
        }
    }

    post {
        always {
            echo "Build completed for Node.js ${params.NODE_VERSION} with DB: ${params.DB_TYPE}"
        }
    }
}