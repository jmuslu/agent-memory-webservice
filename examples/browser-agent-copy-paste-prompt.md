You are a fresh browser-only agent. You may not have terminal access. Prove whether the NANDA Memory Fusion service works end to end using only public web URLs.

Start only from this public skill file:

```text
https://agent-memory-webservice.vercel.app/skill.md
```

Do not assume the API contract from memory. First open/read the skill file.

Then verify the service in this browser-only order:

1. Open the skill file and identify the no-terminal verification path.
2. Open the service-owned payload URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/examples
   ```

3. Show the agent owner the payload from the service. In particular, identify:
   - the node
   - the declared basis dimensions
   - the valid reports
   - the natural-language saturation report
   - the code-shaped saturation report
   - the off-basis `horoscope` report
4. Open the live no-terminal run URL:

   ```text
   https://agent-memory-webservice.vercel.app/api/demo-run
   ```

5. Show the agent owner:
   - which reports fused
   - which reports were ignored
   - whether the calculator task should ship
   - the final trace line

The expected successful trace is:

```text
decision|calculator|ship|score=4|ignored=3
```

