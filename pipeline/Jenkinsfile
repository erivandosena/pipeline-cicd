#!/usr/bin/env groovy

pipeline {
  agent {
    kubernetes {
      yamlFile './jenkins-agent-pod-k8s.yaml'
      inheritFrom 'jnlp'  // all your pods will be named with this prefix, followed by a unique id
      idleMinutes 5  // how long the pod will live after no jobs have run on it
      defaultContainer 'maven'
    }
  }
  options {
    timestamps()
    timeout(time: 2, unit: 'HOURS')
    parallelsAlwaysFailFast()
    rateLimitBuilds(throttle: [count: 3, durationName: 'minute', userBoost: false])
    buildDiscarder(logRotator(numToKeepStr: '100'))
    //gitLabConnection('Gitlab')
    //gitlabCommitStatus(name: "Jenkins build $BUILD_DISPLAY_NAME")
    ansiColor('xterm')
  }
  triggers {
    // replace 0 with H (hash) to randomize starts to spread load and avoid spikes
    //pollSCM('H/60 * * * *')  // execute a cada 60 minutos, em um tempo de deslocamento consistente dentro desse intervalo de 60 minutos
    cron('H 10 * * 1-5')  // executar às 10: XX:XX da manhã todos os dias da semana, ou seja. algum horário fixo de trabalho entre 10-11am
  }
  environment {
    APP_NAME = "sample-app"
    APP_VERSION = "1.0.0"
    APP_NAMESPACE = "app-pipeline-cicd"
    //DOCKER_TAG = "$GIT_COMMIT" // ou "$GIT_BRANCH" que pode ser definido como uma tag git semver
    DOCKER_TAG = "${env.GIT_BRANCH.split('/')[-1]}"  //retire a 'origin/' inicial de 'origin/branch'
    DOCKER_IMAGE = "unlb/${APP_NAME}"
    BUILD_NUMBER = "${env.BUILD_NUMBER}"
    // se criar imagens docker em agentes, isso habilita o BuildKit, que cria automaticamente camadas de imagens em paralelo sempre que possível (especialmente útil para compilações de vários estágios)
    // adicione também '--build-arg BUILDKIT_INLINE_CACHE=1' ao comando docker build
    DOCKER_BUILDKIT = 1
    TF_IN_AUTOMATION = 1  // altera a saída para suprimir as sugestões da CLI para comandos relacionados
    THREAD_COUNT = 6
    //SLACK_MESSAGE = "Pipeline <${env.JOB_DISPLAY_URL}|${env.JOB_NAME}> - <${env.RUN_DISPLAY_URL}|Build #${env.BUILD_NUMBER}>"
    // Altera o tempo limite do trabalho (o padrão é 1800 segundos; defina como 0 para desabilitar
    SEMGREP_TIMEOUT = "300"
  }
  stages {
    // geralmente não é necessário ao obter o Jenkinsfile do Git SCM no Pipeline / Multibranch Pipeline, isso está implícito
    stage ('Checkout') {
      steps {
        milestone(ordinal: null, label: "Milestone: Checkout")
        checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '', url: 'https://github.com/erivandosena/test-pipeline']]])
        //container('git') {
        //  git credentialsId: 'GitHub', url: 'https://github.com/HariSekhon/Jenkins.git', branch: 'master'
        //}
      }
    }
    stage('CI/CD Initialize Setup') {
      steps {
        milestone(ordinal: null, label: "Milestone: Setup")
        label 'Setup'
        script {
          // reescrever o nome da compilação para incluir o ID do commit
          currentBuild.displayName = "$BUILD_DISPLAY_NAME (${GIT_COMMIT.take(8)})"
          // salve o caminho da área de trabalho para usar nos testes
          workspace = "$env.WORKSPACE"
        }
        // execute alguns comandos shell para configurar as coisas
        /*
        sh '''
          for x in /etc/build.d/*.sh; do
            if [ -r "$x" ]; then
              source $x;
            fi;
          done;
        '''
        */
        sh 'printenv'
      }
    }
    stage('Build') {
      steps {  // no container directive is needed as the maven container is the default
        echo "2. Build Application"
        //container('maven') { 
        //sh "mvn clean package -Dmy.variable=${APP_NAME} -Dmy.variable=${APP_VERSION}"
        sh "mvn clean verify"
        sh "mvn install"
        sh "mvn package"
        sh "mvn archetype:generate -DgroupId=br.edu.unilab.app -DartifactId=${APP_NAME} -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false -Dmy.variable=${APP_NAME} -Dmy.variable=${APP_VERSION}"
        //}
      }
    }
    stage('Build Docker Image') {
      steps {
        echo "3. Build of Image"
        container('docker') {  
          milestone(ordinal: null, label: "Milestone: Docker Build")
          timeout(time: 60, unit: 'MINUTES') {
            // check 'DOCKER_BUILDKIT = 1' is set in environment {} section
            //sh "docker build -t '$DOCKER_IMAGE':'$DOCKER_TAG' --build-arg=BUILDKIT_INLINE_CACHE=1 --cache-from '$DOCKER_IMAGE':'$DOCKER_TAG' ."
            sh "docker build -t '$DOCKER_IMAGE':'$DOCKER_TAG' --build-arg='COMMIT_SHA=$GIT_COMMIT' --build-arg='VERSION=$APP_VERSION' --build-arg='BUILDKIT_INLINE_CACHE=1' --cache-from '$DOCKER_IMAGE':'$DOCKER_TAG' ."
          }
          //sh "docker build -t ${IMAGE_TAG} ."  // when we run docker in this step, we're running it via a shell on the docker build-pod container, 
        }
      }
    }
    stage('Docker Push Image') {
      steps {
        echo "4. Push of Image"
        container('docker') { 
          withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
            //sh "docker logout"
            sh "docker login -u ${dockerHubUser} -p ${dockerHubPassword}"
            //sh "docker push ${IMAGE_TAG}"        // which is just connecting to the host docker deaemon
            milestone(ordinal: null, label: "Milestone: Docker Push")
            timeout(time: 15, unit: 'MINUTES') {
              //sh "docker tag '$DOCKER_IMAGE':'$DOCKER_TAG' '$DOCKER_IMAGE:latest'"
              sh "docker push '$DOCKER_IMAGE':'$DOCKER_TAG'"
            }
          }
        }
      }
    }
    stage('Deploy') {
      steps {
        echo "5. Deploy to K8S Cluster"
        //container('maven') {
          sh "sed -i 's/<APP_NAMESPACE>/${env.APP_NAMESPACE}/' k8s.yaml"
          sh "sed -i 's/<APP_NAME>/${env.APP_NAME}/' k8s.yaml"
          sh "sed -i 's/<IMAGE_TAG>/unlb\\/${env.APP_NAME}:${env.DOCKER_TAG}/' k8s.yaml"
          
          // https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
          //sh 'curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"'
          sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"'
          sh 'curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"'
          sh 'echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check'
          sh "chmod u+x ./kubectl"
          sh "install -o root -g root -m 0755 kubectl /usr/bin/kubectl"
          //sh "kubectl cluster-info"
          sh "kubectl version --client -ojson"
          //sh './kubectl apply -f k8s.yaml'      
          //sh "kubectl apply -f k8s.yaml --record"
          //kubernetesDeploy configs: 'k8s.yaml', kubeconfigId: 'K8s-c2-config'
          withKubeConfig([credentialsId: 'K8s-c1-config', serverUrl: 'https://10.130.0.45:6443']) {
            /*
            Teoricamente --record não é obrigatório, porém, tecnicamente torna-se obrigatório para garantir que as 
            alterações deixem um rastro de auditoria rudimentar e cumpram o processo SRE e a cultura DevOps.
            Exemplo de uso: kubectl rollout history -n docker deployment.apps/docker
            Nota: Quando --record não é sinalizador, na tabela, CHANGE-CAUSE estará apenas <none>
            */
            script {
                try {
                    sh 'kubectl get namespace $APP_NAMESPACE'
                    sh 'kubectl delete -f k8s.yaml'
                    sh 'kubectl apply -f k8s.yaml --record'
                } catch (err) {
                    sh 'kubectl apply -f k8s.yaml --record'
                } finally {
                    sh 'kubectl get all,ing -n $APP_NAMESPACE'
                }
            }
        }
      }
    }
  }
}
