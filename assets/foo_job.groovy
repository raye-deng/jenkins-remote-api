stage("checkout"){ echo "checkout code" }
stage("install dependencies"){ echo "install dependencies" }
stage("compile"){ echo "compile code" }
stage("build"){ echo "build artifacts" }
stage("archive"){
    echo "archive artifacts"
    sleep(10)
}
stage("deploy"){ echo "deploy"}