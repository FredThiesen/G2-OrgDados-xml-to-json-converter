1. Problema
   A empresa Contoso Corp é uma multinacional do setor de varejo com sede nos EUA e está em fase de migração dos seus sistemas legados para uma nova plataforma na nuvem. O processo de migração atualmente está enfrentando alguns problemas, pois o sistema legado disponibiliza diariamente milhares de arquivos organizados no formato .XML. O time de arquitetura definiu que esses arquivos precisam ser processados por um sistema intermediário, transformando-os em
   arquivos do tipo .JSON. Após o processo de transformação, o novo sistema deverá ser comunicado e então mover esse arquivo para uma outra pasta/blob chamada Contoso-JSON.
2. Premissas

-   Todo sistema deverá ser desenvolvido na nuvem Azure;
-   O processo todo deve ser iniciado no momento que os arquivos XML forem carregados para o Blob Contoso-JSON;
-   Pense numa arquitetura desacoplada e assíncrona, visto que poderá ser necessário processar milhares ou milhões de arquivos diariamente. Para isso, use um sistema de Filas disponíveis na nuvem (Armazenamento de filas ou Azure Service Bus);
-   Quando terminar de processar o arquivo, o mesmo deverá disparar um evento (Azure Event Grid) informando o novo sistema que o arquivo foi processado e o JSON está disponível;
-   Ao receber o evento o novo sistema deverá mover para pasta Contoso JSON;
-   Avalie usar algoritmos de compressão para o processo;
-   Considerar implementar questões de segurança;
