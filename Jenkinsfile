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
                script {
                    // Assumes nvm is installed or Node.js is pre-installed via Jenkins tool
                    env.PATH = "${tool name: "nodejs-${params.NODE_VERSION}", type: 'NodeJSInstallation'}/bin:${env.PATH}"
                }
            }
        }

        stage('Install Yarn') {
            steps {
                sh 'npm install --global yarn'
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