const { mkdtempSync, writeFileSync, rmSync } = require('fs');
const os = require('os');
const path = require('path');
const { processTransfers } = require('../app');

describe('processTransfers', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(os.tmpdir(), 'mable-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('applies transfers in file order and rejects invalid ones with console errors', () => {
    const balanceFilePath = path.join(tempDir, 'balances.csv');
    const transferFilePath = path.join(tempDir, 'transfers.csv');

    writeFileSync(balanceFilePath, '1111234522226789,5000.00\n1111234522221234,10000.00\n2222123433331212,550.00\n1212343433335665,1200.00\n3212343433335755,50000.00\n');
    writeFileSync(
      transferFilePath,
      '1111234522226789,1212343433335665,500.00\n1111234522226789,9999999999999999,100.00\n3212343433335755,2222123433331212,1000.00\n3212343433335755,1111234522226789,320.50\n1111234522221234,1212343433335665,25.60\n'
    );

    const logger = {
      log: jest.fn(),
      error: jest.fn()
    };

    const balances = processTransfers(balanceFilePath, transferFilePath, logger);

    expect(balances).toEqual([
      { id: '1111234522221234', balance: 9974.4 },
      { id: '1111234522226789', balance: 4820.5 },
      { id: '1212343433335665', balance: 1725.6 },
      { id: '2222123433331212', balance: 1550 },
      { id: '3212343433335755', balance: 48679.5 }
    ]);

    expect(logger.error).toHaveBeenCalledWith(
      'Rejected transfer 1111234522226789 -> 9999999999999999 (100.00): unknown account referenced'
    );
    expect(logger.log).toHaveBeenCalledWith('1111234522221234,9974.40');
  });

  it('rejects transfers with insufficient funds', () => {
    const balanceFilePath = path.join(tempDir, 'balances.csv');
    const transferFilePath = path.join(tempDir, 'transfers.csv');

    writeFileSync(balanceFilePath, '1111234522226789,100.00\n');
    writeFileSync(transferFilePath, '1111234522226789,1111234522226789,200.00\n');

    const logger = {
      log: jest.fn(),
      error: jest.fn()
    };

    const balances = processTransfers(balanceFilePath, transferFilePath, logger);

    expect(balances).toEqual([{ id: '1111234522226789', balance: 100 }]);
    expect(logger.error).toHaveBeenCalledWith(
      'Rejected transfer 1111234522226789 -> 1111234522226789 (200.00): insufficient funds'
    );
  });
});
