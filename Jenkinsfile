pipeline {
  agent {
    // A lépések a hivatalos Node 18 image-ben futnak
    docker {
      image 'node:18-bullseye'
      // ha több build fut egymás után ugyanazon agenten, ne cseréljen workspace-t
      reuseNode true
      // ha jogosultsági gond lenne, add hozzá: args '-u root:root'
    }
  }

  environment {
    // gyorsabb és determinisztikus npm telepítés
    NPM_CONFIG_FUND = 'false'
    NPM_CONFIG_AUDIT = 'false'
    // opcionális cache a workspace-ben (nem kötelező)
    NPM_CONFIG_CACHE = "${env.WORKSPACE}/.npm-cache"
  }

  stages {
    stage('Node & npm info') {
      steps {
        sh 'node -v && npm -v'
      }
    }

    stage('Install Dependencies') {
      steps {
        // ha package-lock.json van: npm ci gyorsabb és megbízhatóbb
        sh '''
          if [ -f package-lock.json ]; then
            npm ci
          else
            npm install
          fi
        '''
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Archive build output') {
      steps {
        // így a Jenkinsből letölthető lesz a build/ tartalma
        archiveArtifacts artifacts: 'build/**', fingerprint: true
      }
    }
  }

  post {
    success { echo ':white_check_mark: Build sikeres (Docker/Node 18)!' }
    failure { echo ':x: Build hiba!' }
  }
}