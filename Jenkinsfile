pipeline {
    agent any

    stages {
        //TODO: PARAR LOS SERVICIOS QUE YA EXISTEN
        stage('Parando los Servicios') {
            steps {
                bat '''
                docker compose -p sgu-cgh-10c down || exit /b 0
            '''
            }
        }

        //TODO: ELIMINAR LA IMAGENES CREADAS POR ESTE PROYECTO
        stage('Eliminando Imagenes'){
            steps{
                bat '''
                for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=sgu-cgh-10c" -q') do (
                        docker rmi -f %%i
                    )
                    if errorlevel 1 (
                        echo No hay imagenes por eliminar
                    ) else (
                        echo Imagenes eliminadas correctamente
                    )
            '''
            }
        }

        //TODO: RECURSO SCM CONFIGURADO EN EL JOB, TRAE EL REPO
        stage('Obteniendo Actualizaciones del Repositorio') {
            steps {
                checkout scm
            }
        }

        //TODO: CONSTRUIR LAS IMAGENES Y LEVANTAR LOS SERVICIOS
        stage('Construyendo y Levantando los Servicios') {
            steps {
                bat '''
                docker compose up --build -d
            '''
            }
        }
    }

    post {
        success {
            echo 'Despliegue completado exitosamente.'
        }

        failure {
            echo 'El despliegue ha fallado.'
        }

        always {
            echo 'Proceso de despliegue finalizado.'
        }
    }
}