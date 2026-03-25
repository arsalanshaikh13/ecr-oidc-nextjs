#!/bin/bash

terraform apply -var-file=dev.tfvars -parallelism -auto-approve