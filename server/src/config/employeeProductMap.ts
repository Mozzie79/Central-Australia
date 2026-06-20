export type EmployeeAllocation = {
  positionNumber: string;
  costCentre: string;
  name: string;
  allocations: Record<string, number>;
};

// Per-employee-row product split, extracted from the "Employee Expense" sheet's own
// allocation columns (cols 27-53, "which product does this position's cost belong to").
// Joined against the raw upload by (positionNumber, costCentre) rather than name, since a
// position split across cost centres (e.g. half Mainframe / half Midrange) produces two rows
// with the same position number and the same person's name can repeat across rows that aren't
// otherwise disambiguated (e.g. "ROBAYE, Joshua Didier Pascal").
export const EMPLOYEE_ALLOCATIONS: EmployeeAllocation[] = [
  { positionNumber: "020008", costCentre: "661011", name: "HARRISON, Shane Michael", allocations: { "BASE": 1.0 } },
  { positionNumber: "020010", costCentre: "661021", name: "MORTIMER, Paul", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "024530", costCentre: "661041", name: "WALKER, Daniel Scott", allocations: { "SAN Storage": 0.9, "SAN Storage ABS-HSS": 0.1 } },
  { positionNumber: "005547", costCentre: "661021", name: "FONG, Michael Thomas", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "024074", costCentre: "661021", name: "BETHUNE, Luke", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "000120", costCentre: "661041", name: "REICHELT, Linc Travis", allocations: { "SAN Storage": 1.0 } },
  { positionNumber: "025310", costCentre: "661021", name: "METCALF, Shaun Kenneth", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "013178", costCentre: "661041", name: "RICE, Simon Christopher", allocations: { "SAN Storage": 1.0 } },
  { positionNumber: "000527", costCentre: "661021", name: "JEFFERSON, Dale Alan", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "000377", costCentre: "661021", name: "DE JESUS, Glen Capilitan", allocations: { "SAN Storage": 0.9, "SAN Storage ABS-HSS": 0.1 } },
  { positionNumber: "000115", costCentre: "661011", name: "PEMARATHNE, Eluwahandi Data Karunika1", allocations: { "DB2": 1.0 } },
  { positionNumber: "000115", costCentre: "661021", name: "PEMARATHNE, Eluwahandi Data Karunika2", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "003310", costCentre: "661041", name: "SHUKLA, Vivek Janakbhai", allocations: { "SAN Storage": 1.0 } },
  { positionNumber: "027225", costCentre: "661041", name: "MANHIRE, Dylan James", allocations: { "SAN Storage": 1.0 } },
  { positionNumber: "023497", costCentre: "661021", name: "KARKI, Ajin", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "025170", costCentre: "661011", name: "RUSSELL, Haydn Mark1", allocations: { "BASE": 1.0 } },
  { positionNumber: "000124", costCentre: "661062", name: "PICKER, James Malcolm", allocations: { "Server Hosting GDC": 1.0 } },
  { positionNumber: "010966", costCentre: "661011", name: "KRINK, Andrew", allocations: { "BASE": 0.4, "STORAGE": 0.6 } },
  { positionNumber: "000089", costCentre: "661062", name: "MCKIRDY, Bradley", allocations: { "Operations": 1.0 } },
  { positionNumber: "000093", costCentre: "661062", name: "MCHENDRIE, Mignon Anne", allocations: { "Operations": 1.0 } },
  { positionNumber: "000204", costCentre: "661011", name: "COGHILL, Bruce Richard", allocations: { "EGL": 0.5, "BASE": 0.5 } },
  { positionNumber: "023496", costCentre: "661011", name: "WELSH, Patrick", allocations: { "BASE": 1.0 } },
  { positionNumber: "024758", costCentre: "661062", name: "MEREDITH, David Alan", allocations: { "Server Hosting GDC": 1.0 } },
  { positionNumber: "000063", costCentre: "661062", name: "STRZELECKI, Joshua Peter", allocations: { "Operations": 1.0 } },
  { positionNumber: "000138", costCentre: "661062", name: "BARTLETT, Philip Anthony", allocations: { "Operations": 1.0 } },
  { positionNumber: "000193", costCentre: "661011", name: "RICO NOLASCO, Brisa Ariana", allocations: { "EGL": 0.5, "BASE": 0.5 } },
  { positionNumber: "SUPN", costCentre: "661062", name: "POTTS, Michael Jeffrey", allocations: { "Operations": 1.0 } },
  { positionNumber: "032234", costCentre: "661062", name: "GRANTHAM, Hayden Mark", allocations: { "Operations": 1.0 } },
  { positionNumber: "000116", costCentre: "661062", name: "LEONARD-BOND, Paul Martin", allocations: { "Operations": 1.0 } },
  { positionNumber: "023495", costCentre: "661011", name: "YEUNG, Wai Ming", allocations: { "BASE": 1.0 } },
  { positionNumber: "000172", costCentre: "661062", name: "KREPAPAS, George", allocations: { "Operations": 1.0 } },
  { positionNumber: "043834", costCentre: "661011", name: "WOOLLEY, Elina Louise", allocations: { "BASE": 1.0 } },
  { positionNumber: "023055", costCentre: "661062", name: "WHEELER, Jahkeem Ty", allocations: { "Operations": 1.0 } },
  { positionNumber: "023056", costCentre: "661062", name: "ALTHOUSE, Ashlee Marie", allocations: { "Operations": 1.0 } },
  { positionNumber: "023053", costCentre: "661062", name: "FITZGERALD, Michael Robert", allocations: { "Operations": 1.0 } },
  { positionNumber: "023054", costCentre: "661062", name: "LEES, Kahne Cooper", allocations: { "Operations": 1.0 } },
  { positionNumber: "000085", costCentre: "661011", name: "MADDOCK, Ross Warren", allocations: { "Application Services": 0.05, "BASE": 0.75, "STORAGE": 0.2 } },
  { positionNumber: "000121", costCentre: "661011", name: "KNOX, Woyan", allocations: { "Application Services": 0.05, "BASE": 0.95 } },
  { positionNumber: "000091", costCentre: "661011", name: "HARLEY, Jessica", allocations: { "Application Services": 0.05, "BASE": 0.95 } },
  { positionNumber: "000092", costCentre: "661011", name: "ROBAYE, Joshua Didier Pascal", allocations: { "BASE": 1.0 } },
  { positionNumber: "023214", costCentre: "661011", name: "TURNER, Jaxson Judd Judd", allocations: { "BASE": 1.0 } },
  { positionNumber: "034078", costCentre: "661081", name: "DAVEY, Priya Ann", allocations: { "Application Services": 1.0 } },
  { positionNumber: "034535", costCentre: "661081", name: "JESSOP, Nicolle Lee", allocations: { "Application Services": 1.0 } },
  { positionNumber: "044478", costCentre: "661081", name: "CHU, Dominic", allocations: { "Application Services": 1.0 } },
  { positionNumber: "033990", costCentre: "661062", name: "NORRISS, Steven", allocations: { "Operations": 1.0 } },
  { positionNumber: "025109", costCentre: "661041", name: "Vacant MR3", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "023215", costCentre: "661062", name: "Vacant Ops1", allocations: { "Operations": 1.0 } },
  { positionNumber: "043835", costCentre: "661021", name: "LU, Wen", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "000374", costCentre: "661021", name: "Vacant MR1", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "000151", costCentre: "661021", name: "Vacant MR2", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "004625", costCentre: "661041", name: "Vacant MR7", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
  { positionNumber: "025170", costCentre: "661021", name: "RUSSELL, Haydn Mark2", allocations: { "Application Hosting": 0.06, "Oracle Database Hosting": 0.06, "SQL Database Hosting": 0.09, "Windows OS": 0.22, "RedHat OS": 0.03, "Website Hosting Services": 0.02, "Sharepoint": 0.03, "VMWare": 0.4, "Domino / Lotus Notes": 0.06, "App Management": 0.02, "Disk Fixed File": 0.01 } },
];
