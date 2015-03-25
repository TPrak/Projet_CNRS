
#include <Process.h>

void setup() {
  Bridge.begin();	// Initialize the Bridge
  Serial.begin(9600);	// Initialize the Serial

  // Wait until a Serial Monitor is connected.
  while (!Serial);
}

void loop() {
  Process p;
  String ligne;
  p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"insert into donnees(id_capteur,val,date_time,flag) values (1,50,datetime('now'),0) ;\"");

  // do nothing until the process finishes, so you get the whole output:
  while (p.running());

  // Read command output. runShellCommand()
  while (p.available()>0) {
    char c = p.read();
    Serial.print(c);    
  }
  Serial.flush();
  Serial.println("Done");
  p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"select * from donnees ;\"");
   while (p.running());

  // Read command output. runShellCommand()
  while (p.available()>0) {
    char c = p.read();
    if(c != '\0' && c!='\n' && c!='\r')
      ligne+=c;
    else
    {
      Serial.println(ligne); 
      ligne="";
    }
  }
  Serial.flush();
  Serial.println("Done");
  while(1) { };
}

