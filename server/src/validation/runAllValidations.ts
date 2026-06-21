import type { SheetValidation } from '@dcs/shared';
import { runAppServicesValidation } from '../calc/costBuildUp/appServices.validation.js';
import { runEsBackupsBackupStorageValidation } from '../calc/costBuildUp/esBackupsBackupStorage.validation.js';
import { runEsStorageSanStorageValidation } from '../calc/costBuildUp/esStorageSanStorage.validation.js';
import { runEsStorageSanStorageAbsHssValidation } from '../calc/costBuildUp/esStorageSanStorageAbsHss.validation.js';
import { runMfBaseValidation } from '../calc/costBuildUp/mfBase.validation.js';
import { runMfDb2Validation } from '../calc/costBuildUp/mfDb2.validation.js';
import { runMfEglValidation } from '../calc/costBuildUp/mfEgl.validation.js';
import { runMfMqValidation } from '../calc/costBuildUp/mfMq.validation.js';
import { runMfStorageValidation } from '../calc/costBuildUp/mfStorage.validation.js';
import { runMrAppHostValidation } from '../calc/costBuildUp/mrAppHost.validation.js';
import { runMrAppManagementValidation } from '../calc/costBuildUp/mrAppManagement.validation.js';
import { runMrAzureServicesValidation } from '../calc/costBuildUp/mrAzureServices.validation.js';
import { runMrDbHostingMysqlValidation } from '../calc/costBuildUp/mrDbHostingMysql.validation.js';
import { runMrDbHostingNotesValidation } from '../calc/costBuildUp/mrDbHostingNotes.validation.js';
import { runMrDbHostingOracleValidation } from '../calc/costBuildUp/mrDbHostingOracle.validation.js';
import { runMrDbHostingSqlValidation } from '../calc/costBuildUp/mrDbHostingSql.validation.js';
import { runMrVirtualServerDiskFixedFileValidation } from '../calc/costBuildUp/mrVirtualServerDiskFixedFile.validation.js';
import { runMrVirtualServerDiskVariableValidation } from '../calc/costBuildUp/mrVirtualServerDiskVariable.validation.js';
import { runMrVirtualServerRedhatOsValidation } from '../calc/costBuildUp/mrVirtualServerRedhatOs.validation.js';
import { runMrVirtualServerVmwareValidation } from '../calc/costBuildUp/mrVirtualServerVmware.validation.js';
import { runMrVirtualServerWindowsOsValidation } from '../calc/costBuildUp/mrVirtualServerWindowsOs.validation.js';
import { runMrWebHostingSharepointValidation } from '../calc/costBuildUp/mrWebHostingSharepoint.validation.js';
import { runMrWebHostingSquizMatrixValidation } from '../calc/costBuildUp/mrWebHostingSquizMatrix.validation.js';
import { runMrWebHostingWebsiteHostingValidation } from '../calc/costBuildUp/mrWebHostingWebsiteHosting.validation.js';
import { runOperationsValidation } from '../calc/costBuildUp/operations.validation.js';
import { runServerHostingBdcValidation } from '../calc/costBuildUp/serverHostingBdc.validation.js';
import { runServerHostingGdcValidation } from '../calc/costBuildUp/serverHostingGdc.validation.js';
import { runProductRevenueValidation } from '../calc/pricing/productRevenue.validation.js';
import { runDcsSummaryValidations } from '../calc/summary/dcsSummary.validation.js';
import { runFamilyRollupValidations } from '../calc/summary/familyRollup.validation.js';
import { runAsSummaryValidation } from '../calc/usageAllocation/asSummary.validation.js';
import { runCpuChargeValidation } from '../calc/usageAllocation/cpuCharge.validation.js';
import { runDasdChargeValidation } from '../calc/usageAllocation/dasdCharge.validation.js';
import { runDb2ChargeValidation } from '../calc/usageAllocation/db2Charge.validation.js';
import { runEglChargeValidation } from '../calc/usageAllocation/eglCharge.validation.js';
import { runPivotAgencyValidation } from '../calc/usageAllocation/pivotAgency.validation.js';

export function runAllValidations(): SheetValidation[] {
  return [
    runAppServicesValidation(),
    runEsBackupsBackupStorageValidation(),
    runEsStorageSanStorageValidation(),
    runEsStorageSanStorageAbsHssValidation(),
    runMfBaseValidation(),
    runMfDb2Validation(),
    runMfEglValidation(),
    runMfMqValidation(),
    runMfStorageValidation(),
    runMrAppHostValidation(),
    runMrAppManagementValidation(),
    runMrAzureServicesValidation(),
    runMrDbHostingMysqlValidation(),
    runMrDbHostingNotesValidation(),
    runMrDbHostingOracleValidation(),
    runMrDbHostingSqlValidation(),
    runMrVirtualServerDiskFixedFileValidation(),
    runMrVirtualServerDiskVariableValidation(),
    runMrVirtualServerRedhatOsValidation(),
    runMrVirtualServerVmwareValidation(),
    runMrVirtualServerWindowsOsValidation(),
    runMrWebHostingSharepointValidation(),
    runMrWebHostingSquizMatrixValidation(),
    runMrWebHostingWebsiteHostingValidation(),
    runOperationsValidation(),
    runServerHostingBdcValidation(),
    runServerHostingGdcValidation(),
    runProductRevenueValidation(),
    ...runDcsSummaryValidations(),
    ...runFamilyRollupValidations(),
    runAsSummaryValidation(),
    runCpuChargeValidation(),
    runDasdChargeValidation(),
    runDb2ChargeValidation(),
    runEglChargeValidation(),
    runPivotAgencyValidation(),
  ];
}
