#include <Bridge.h>
const float coeff_division = 2.6;
Process p;

void setup() {
  // put your setup code here, to run once:
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
  Bridge.begin();

}

void loop() {
  // put your main code here, to run repeatedly:
  /* Mesure de la tension brute */
  unsigned int raw_bat = analogRead(A0);
  /* Calcul de la tension réel */
  float real_bat = ((raw_bat * (5.0 / 1024)) * coeff_division);
  p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"insert into donnees(id_capteur,val,date_time,flag) values (4," + (String)real_bat + ",datetime('now'),0) ;\"");
  while (p.running());

  delay(30000);

}
