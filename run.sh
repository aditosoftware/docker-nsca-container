#!/bin/bash
echo "password=$NSCAPASS" > /nsca.conf
echo "encryption_method=1" >> /nsca.conf

while true; do
	nodejs /start.js
	sleep 2m
done
