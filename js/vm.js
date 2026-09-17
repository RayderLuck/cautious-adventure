export function initVMConfig(){
  return {
    memory_size: 128 * 1024 * 1024,
  };
}

export async function mountVaultIntoVM(emulator, decryptedFiles){
  console.log("Montando vault na VM", decryptedFiles);
}
