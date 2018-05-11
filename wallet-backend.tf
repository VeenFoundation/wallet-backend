provider "aws" {
  region     = "ap-northeast-2"
}

resource "aws_instance" "liveen-wallet-backend" {
  ami           = "ami-a414b9ca"
  instance_type = "t2.medium"
  key_name      = "liveen"

  tags {
      Name = "LiveenWallet"
  }
}